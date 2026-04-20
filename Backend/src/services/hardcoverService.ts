import fetch from "node-fetch";
import type { RequestInit } from "node-fetch";
import redis from "../redis";
import { LRUCache } from "lru-cache";

const HARDCOVER_API = "https://api.hardcover.app/v1/graphql";
const TOKEN = process.env.HARDCOVER_TOKEN;
if (!TOKEN) console.warn("⚠️ HARDCOVER_TOKEN no definido. Algunas funciones fallarán.");

export interface HardcoverBook {
  id: number;
  title: string;
  slug: string;
  activities_count: number;
  coverUrl: string | null;
  authors: string[];
  description: string | null;
}

interface HardcoverEdition {
  image?: { url: string; width?: number; height?: number };
  language?: { id?: number };
}

// --- util: evita placeholders comunes ---
const isPlaceholderUrl = (url?: string) =>
  !url || /placeholder|no_image|nophoto|default_cover/i.test(url);

// --- Scoring simple para elegir mejor portada ---
function getBestCover(editions: HardcoverEdition[]): string | null {
  let bestUrl: string | null = null;
  let bestScore = -Infinity;

  for (const ed of editions || []) {
    const img = ed.image;
    if (!img?.url || isPlaceholderUrl(img.url)) continue;

    const width = Math.max(0, img.width ?? 0);
    const height = Math.max(0, img.height ?? 0);
    const size = width * height; // proxy de resolución
    const ratio = width > 0 ? height / width : 0;
    const portraitBonus = ratio >= 1.2 && ratio <= 2.5 ? 1.0 : 0; // favorece retrato
    const langBonus = ed.language?.id === 1 ? 1_000_000 : 0; // preferir idioma id=1 (ejemplo)
    const score = Math.log1p(size) * (1 + portraitBonus) + langBonus;

    if (score > bestScore) {
      bestScore = score;
      bestUrl = img.url!;
    }
  }

  if (!bestUrl) return null;

  try {
    // normalizar a un width razonable; conservamos otros query params
    bestUrl = bestUrl.replace(/\/w\d+(?=\/|$)/i, "/w800");
    bestUrl = bestUrl.replace(/([?&]width=)\d+/i, (m, p1) => `${p1}800`);
  } catch {
    // fallback a la URL original
  }

  return bestUrl;
}

// --- Retry con timeout, comprobación de content-type y jitter ---
async function fetchWithRetry(
  query: string,
  {
    retries = 3,
    baseDelayMs = 500,
    timeoutMs = 15_000, // 15s por defecto
    variables,
  }: { retries?: number; baseDelayMs?: number; timeoutMs?: number; variables?: any } = {}
): Promise<any> {
  if (!TOKEN) throw new Error("HARDCOVER_TOKEN no definido en .env");

  let currentTimeout = timeoutMs;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), currentTimeout);

    try {
      const res = await fetch(HARDCOVER_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ query, ...(variables && { variables }) }),
        signal: controller.signal,
      } as RequestInit);

      clearTimeout(timer);

      const text = await res.text();
      const contentType = (res.headers && res.headers.get && res.headers.get("content-type")) || "";

      if (!/application\/json/i.test(contentType)) {
        const snippet = text ? text.slice(0, 1000) : "<empty body>";
        const msg = `Non-JSON response from Hardcover. status=${res.status} ${res.statusText} url=${(res as any).url || "unknown"} content-type=${contentType} body_snippet=${snippet}`;
        throw new Error(msg);
      }

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`Respuesta JSON inválida (primeros 1000 chars): ${text.slice(0, 1000)}`);
      }

      if (!res.ok || json.errors) {
        const msg =
          (json?.errors && json.errors.map((e: any) => e.message).join(" | ")) ||
          `${res.status} ${res.statusText}`;
        if (res.status >= 400 && res.status < 500) {
          throw new Error(`Hardcover client error: ${msg}`);
        }
        throw new Error(`Hardcover server error: ${msg}`);
      }

      return json.data;
    } catch (err: any) {
      clearTimeout(timer);
      const errStr = String(err);
      const isAbort = err?.name === "AbortError" || /aborted|abort/i.test(errStr);
      const isNonJson = /Non-JSON response|Respuesta JSON inválida/i.test(errStr);

      if (/401|403|client error/i.test(errStr)) {
        console.error("Hardcover client error (no reintentar):", errStr);
        throw err;
      }

      if (isNonJson) {
        console.error("Non-JSON response detected, abortando reintentos:", errStr);
        throw err;
      }

      if (attempt < retries) {
        const backoff = baseDelayMs * Math.pow(2, attempt);
        const jitter = Math.floor(Math.random() * baseDelayMs);
        const delay = backoff + jitter;

        if (isAbort) {
          console.warn(
            `Hardcover fetch abortado (intento ${attempt + 1}/${retries + 1}). timeout=${currentTimeout}ms. Reintentando en ${delay}ms...`
          );
        } else {
          console.warn(
            `Hardcover fetch fallo (intento ${attempt + 1}/${retries + 1}): ${errStr}. Reintentando en ${delay}ms...`
          );
        }

        await new Promise((r) => setTimeout(r, delay));
        currentTimeout = Math.min(Math.round(currentTimeout * 1.5), 60_000);
      } else {
        const finalMsg = `Hardcover trending error: ${errStr}`;
        console.error(finalMsg);
        throw new Error(finalMsg);
      }
    } finally {
      clearTimeout(timer);
    }
  }
}

// --- Cache híbrido: LRU en memoria + in-flight dedupe ---
const CACHE_KEY = "hardcover:trending";

// memory vs redis TTLs
const MEMORY_TTL_SEC = 3600; // 1 hora en memoria local
const REDIS_TTL_SEC = 12 * 3600; // 12 horas en Upstash/Redis
const MAX_MEM_ENTRIES = 200;

// usamos lru-cache para TTL y LRU automático
const memoryCache = new LRUCache<string, { data: HardcoverBook[]; expiresAt: number }>({
  max: MAX_MEM_ENTRIES,
  ttl: MEMORY_TTL_SEC * 1000,
});

const inFlight = new Map<string, Promise<HardcoverBook[]>>();

// Control simple para evitar refrescar en background demasiado seguido
let lastBackgroundRefreshAt = 0;
const BACKGROUND_MIN_INTERVAL_MS = 60 * 1000; // 1 minuto
// Umbral: solo refrescar en background si queda poco tiempo de memoria (ej: 25% del TTL)
const BACKGROUND_REFRESH_THRESHOLD_MS = Math.max(15 * 1000, Math.round(MEMORY_TTL_SEC * 1000 * 0.25));
// jitter máximo antes de lanzar el refresh en background para evitar stampede
const BACKGROUND_REFRESH_JITTER_MS = 5_000; // hasta 5s de jitter

// cuánto esperar por la promesa inFlight antes de devolver "loading" (ms)
const INFLIGHT_WAIT_MS = 10000; // 10s: ajustable según experiencia de UX

// métrica simple para fallos de redis (puedes exponer esto por logs/metrics)
let redisFailureCount = 0;

// Helper parse safe
function safeParse<T>(s: string | null): T | null {
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

/** Helper: espera una promesa hasta timeout. 
 *  Si resuelve antes del timeout devuelve { timedOut:false, result }, si no devuelve { timedOut:true }.
 */
async function waitForPromiseWithTimeout<T>(
  p: Promise<T>,
  ms: number
): Promise<{ timedOut: false; result: T } | { timedOut: true }> {
  let timeoutHandle: NodeJS.Timeout;
  const timeoutPromise = new Promise<{ timedOut: true }>((res) => {
    timeoutHandle = setTimeout(() => res({ timedOut: true }), ms);
  });

  try {
    const res = await Promise.race([p.then((r) => ({ timedOut: false, result: r })), timeoutPromise]);
    clearTimeout(timeoutHandle!);
    return res as any;
  } catch (err) {
    clearTimeout(timeoutHandle!);
    // If the promise rejects quickly, propagate that as a non-timeout failure
    throw err;
  }
}

/**
 * refreshTrendingBooks:
 * - fuerza llamada a la API (con dedup via inFlight)
 * - actualiza memoria y Redis (con EX)
 */
export async function refreshTrendingBooks(): Promise<HardcoverBook[]> {
  // si ya hay un refresh en vuelo, devolver esa promesa (dedupe)
  if (inFlight.has(CACHE_KEY)) return inFlight.get(CACHE_KEY)!;

  const p = (async (): Promise<HardcoverBook[]> => {
    const now = Date.now();

    const query = `
      query {
        books(order_by: {activities_count: desc}, limit: 15) {
          id
          title
          slug
          activities_count
          description
          editions(limit: 5) {
            image { url width height }
            language { id }
          }
          contributions {
            author {
              id
              name
            }
          }
        }
      }
    `;

    let data;
    try {
      data = await fetchWithRetry(query);
    } catch (err) {
      console.error("refreshTrendingBooks: fetchWithRetry falló:", String(err));
      throw err;
    }

    if (!data || !Array.isArray(data.books)) {
      console.warn("refreshTrendingBooks: respuesta inesperada de Hardcover, data.books no es array.");
      return [];
    }

    const books: HardcoverBook[] = data.books.map((b: any) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      activities_count: b.activities_count,
      coverUrl: getBestCover(b.editions || []),
      authors: b.contributions?.map((c: any) => c.author?.name).filter(Boolean) || [],
      description: b.description || null,
    }));

    // guardar en memoria (LRU cache maneja TTL internamente)
    try {
      memoryCache.set(CACHE_KEY, { data: books, expiresAt: now + MEMORY_TTL_SEC * 1000 });
    } catch (err) {
      console.error("Error guardando en memoryCache:", String(err));
    }

    // guardar en redis con EX (si disponible) usando REDIS_TTL_SEC
    if (redis) {
      try {
        await redis.setex(CACHE_KEY, REDIS_TTL_SEC, JSON.stringify(books));
      } catch (err) {
        redisFailureCount++;
        console.error("Redis set error (refreshTrendingBooks):", String(err));
      }
    }

    return books;
  })();

  inFlight.set(CACHE_KEY, p);
  p.finally(() => inFlight.delete(CACHE_KEY));
  return p;
}

/**
 * getTrendingBooks:
 * - Now returns Promise<HardcoverBook[] | null>
 * - If it returns `null` => frontend should show loading/pollito.
 *
 * Behavior:
 * 1) If memory has valid data -> return it (and maybe refresh in background).
 * 2) If memory has expired-but-present data -> return old data (and trigger background refresh).
 * 3) If an inFlight fetch is running -> wait up to INFLIGHT_WAIT_MS for it; if it resolves quickly return data;
 *    otherwise return null (so frontend keeps the loading indicator).
 * 4) If Redis has data -> load to memory and return it.
 * 5) If nothing -> trigger a refresh (which sets inFlight) and wait up to INFLIGHT_WAIT_MS; if resolves return data;
 *    otherwise return null.
 */
export async function getTrendingBooks(): Promise<HardcoverBook[] | null> {
  const now = Date.now();

  // 1) memoryCache (super rápido)
  const mem = memoryCache.get(CACHE_KEY);
  if (mem && mem.expiresAt > now) {
    console.debug("cache: memory hit");
    // disparar refresh en background solo si la memoria está por expirar
    maybeBackgroundRefresh(mem.expiresAt);
    return mem.data;
  }

  // If memory exists but expired (LRU might keep it for short time), return it as stale fallback
  if (mem) {
    console.debug("cache: memory stale - returning stale data and triggering background refresh");
    // remove so subsequent calls see it's stale; we still return stale data immediately
    memoryCache.delete(CACHE_KEY);
    // trigger background refresh
    maybeBackgroundRefresh();
    return mem.data;
  }

  // If a fetch is already in flight, wait a short time for it (so frontend keeps loading).
  if (inFlight.has(CACHE_KEY)) {
    console.debug(`inflight: fetch in progress - waiting up to ${INFLIGHT_WAIT_MS}ms`);
    const p = inFlight.get(CACHE_KEY)!;
    try {
      const res = await waitForPromiseWithTimeout(p, INFLIGHT_WAIT_MS);
      if (!res.timedOut) {
        console.debug("inflight: completed within wait window, returning data");
        return res.result;
      }
      console.debug("inflight: still running after wait window, returning null to indicate loading");
      return null; // frontend shows loading (pollito)
    } catch (err) {
      console.error("inflight: promise rejected while waiting:", String(err));
      // fallthrough to try redis or trigger new background refresh
    }
  }

  // 2) intentar Redis (fast path server-wide)
  if (redis) {
    try {
      const cached = await redis.get(CACHE_KEY);
      const parsed = safeParse<HardcoverBook[]>(cached);
      if (parsed && Array.isArray(parsed)) {
        console.debug("cache: redis hit - populating memory and returning redis data");
        const expiresAt = now + MEMORY_TTL_SEC * 1000;
        memoryCache.set(CACHE_KEY, { data: parsed, expiresAt });
        maybeBackgroundRefresh(expiresAt);
        return parsed;
      }
      console.debug("cache: redis miss");
    } catch (err) {
      redisFailureCount++;
      console.error("Redis get error (getTrendingBooks):", String(err));
      // continue to triggering a refresh
    }
  }

  // 3) No memory, no redis, no inflight -> trigger refresh and wait a short window
  console.debug("cache: empty - triggering refresh and waiting briefly for data");
  // This will set inFlight inside refreshTrendingBooks
  try {
    const inflightPromise = refreshTrendingBooks(); // will be stored into inFlight inside the function
    // wait up to INFLIGHT_WAIT_MS for the initial fetch so frontend may get data without reload
    try {
      const res = await waitForPromiseWithTimeout(inflightPromise, INFLIGHT_WAIT_MS);
      if (!res.timedOut) {
        console.debug("initial refresh completed within wait window, returning data");
        return res.result;
      }
      console.debug("initial refresh still running after wait window, returning null to indicate loading");
      return null; // frontend: show pollito / loading
    } catch (err) {
      console.error("initial refresh promise rejected:", String(err));
      return null;
    }
  } catch (err) {
    console.error("getTrendingBooks: failed to start refreshTrendingBooks:", String(err));
    return null;
  }
}

/**
 * buscarLibroHardcover: Busca un libro específico por slug en Hardcover API
 */
export async function buscarLibroHardcover(slug: string): Promise<HardcoverBook | null> {
  if (!slug) return null;

  console.log('buscarLibroHardcover: intentando buscar libro con slug:', slug);

  const query = `
    query GetBookBySlug($slug: String!) {
      books(where: { slug: { _eq: $slug } }, limit: 1) {
        id
        title
        slug
        activities_count
        description
        release_date
        subtitle
        contributions {
          author {
            name
          }
        }
        editions(limit: 10) {
          image { url width height }
          language { id }
        }
      }
    }
  `;

  try {
    const data = await fetchWithRetry(query, {
      retries: 2,
      baseDelayMs: 300,
      timeoutMs: 10_000,
      variables: { slug },
    });

    console.log('buscarLibroHardcover: respuesta de la API:', data);

    if (!data || !Array.isArray(data.books) || data.books.length === 0) {
      console.log('buscarLibroHardcover: no se encontró el libro o respuesta inválida');
      return null;
    }

    const book = data.books[0];
    console.log('buscarLibroHardcover: libro encontrado:', book);
    return {
      id: book.id,
      title: book.title,
      slug: book.slug,
      activities_count: book.activities_count,
      coverUrl: getBestCover(book.editions || []),
      authors: book.contributions?.map((c: any) => c.author?.name).filter(Boolean) || [],
      description: book.description || null,
    };
  } catch (error) {
    console.error('Error buscando libro por slug en Hardcover:', error);
    return null;
  }
}

/**
 * maybeBackgroundRefresh:
 * - Lanza un refresh en background si no hay uno en vuelo, pasó el intervalo mínimo
 *   y (si se pasa expiresAt) la memoria está cerca de expirar.
 * - Introduce un pequeño jitter antes de ejecutar para evitar stampede entre instancias.
 */
function maybeBackgroundRefresh(expiresAt?: number) {
  const now = Date.now();
  if (inFlight.has(CACHE_KEY)) return; // ya hay un refresh en vuelo
  if (now - lastBackgroundRefreshAt < BACKGROUND_MIN_INTERVAL_MS) return; // demasiado reciente

  // si tenemos un expiresAt y falta mucho tiempo, evitamos refrescar ahora
  if (typeof expiresAt === "number" && expiresAt - now > BACKGROUND_REFRESH_THRESHOLD_MS) return;

  lastBackgroundRefreshAt = now;

  // jitter antes de disparar (evitar stampede si muchas instancias coinciden)
  const jitter = Math.floor(Math.random() * BACKGROUND_REFRESH_JITTER_MS);
  setTimeout(() => {
    // disparar y loguear errores, pero no propagar
    refreshTrendingBooks()
      .then(() => console.debug("background refreshTrendingBooks: OK"))
      .catch((err) => {
        console.error("Background refreshTrendingBooks falló:", String(err));
      });
  }, jitter);
  return;
}
