import fetch, { RequestInit } from "node-fetch";
import redis from "../redis";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";
const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const CACHE_KEY_PREFIX = "google:books:";
const CACHE_TTL_SEC = 3600; // 1 hora en memoria local
const REDIS_TTL_SEC = 12 * 3600; // 12 horas en Redis
const EMPTY_TTL_SEC = 60; // 1 minuto para resultados vacíos o fallos temporales
const MAX_MEM_ENTRIES = 200; // límite simple en memoria
const FETCH_TIMEOUT_MS = 6_000; // timeout fetch

type BookResult = {
  id: string;
  titulo: string;
  autores: string[];
  descripcion: string | null;
  imagen: string | null;
  enlace: string | null;
};

// Map mantiene orden de inserción -> permite eliminación LRU simple
const memoryCache = new Map<string, { data: BookResult[] | BookResult; expiresAt: number }>();

// Para evitar múltiples fetches concurrentes para la misma query
const inFlightRequests = new Map<string, Promise<BookResult[]>>();

// Normaliza la query para generar cache keys más estables
const normalizeQuery = (q: string) => q.trim().toLowerCase();

const makeCacheKey = (q: string) => `${CACHE_KEY_PREFIX}${encodeURIComponent(q)}`;

let redisFailureCount = 0;

// Safe JSON parse helper
function safeParse<T>(s: string | null): T | null {
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

// small jitter helper for TTL (seconds)
function ttlWithJitter(baseSec: number, maxJitterSec = 60) {
  const jitter = Math.floor(Math.random() * (maxJitterSec + 1)); // 0..maxJitterSec
  return baseSec + jitter;
}

export const getBookById = async (bookId: string): Promise<BookResult | null> => {
  if (!bookId) return null;

  const cacheKey = `${CACHE_KEY_PREFIX}id:${bookId}`;
  const now = Date.now();

  // 1️⃣ Cache en memoria
  const mem = memoryCache.get(cacheKey);
  if (mem && mem.expiresAt > now) return mem.data as BookResult;
  if (mem) memoryCache.delete(cacheKey);

  // 2️⃣ Cache Redis
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      const parsed = safeParse<BookResult>(cached);
      if (parsed) {
        memoryCache.set(cacheKey, { data: parsed, expiresAt: now + CACHE_TTL_SEC * 1000 });
        if (memoryCache.size > MAX_MEM_ENTRIES) {
          const oldestKey = memoryCache.keys().next().value;
          if (oldestKey !== undefined) memoryCache.delete(oldestKey);
        }
        return parsed;
      }
    } catch (err) {
      redisFailureCount++;
      console.error("Redis get error:", err);
    }
  }

  // 3️⃣ Fetch desde Google Books
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const url = `${GOOGLE_BOOKS_API}/${bookId}${API_KEY ? `?key=${API_KEY}` : ""}`;
    const res = await fetch(url, { signal: controller.signal } as RequestInit);
    clearTimeout(timeout);

    if (!res.ok) {
      console.error(`Google Books API returned ${res.status} for book ID ${bookId}`);
      return null;
    }

    const item: any = await res.json();
    const result: BookResult = {
      id: item.id,
      titulo: item.volumeInfo?.title || "Título desconocido",
      autores: item.volumeInfo?.authors || [],
      descripcion: item.volumeInfo?.description || null,
      imagen: item.volumeInfo?.imageLinks?.thumbnail || null,
      enlace: item.volumeInfo?.infoLink || null,
    };

    memoryCache.set(cacheKey, { data: result, expiresAt: now + CACHE_TTL_SEC * 1000 });
    if (memoryCache.size > MAX_MEM_ENTRIES) {
      const oldestKey = memoryCache.keys().next().value;
      if (oldestKey !== undefined) memoryCache.delete(oldestKey);
    }

    // Removed Redis caching for Google Books data

    return result;
  } catch (err: any) {
    clearTimeout(timeout);
    console.error("Error obteniendo libro por ID:", err);
    return null;
  }
};

export const buscarLibro = async (
  rawQuery: string,
  startIndex: number = 0,
  maxResults: number = 40
): Promise<BookResult[]> => {
  if (!rawQuery) return [];

  if (!API_KEY) {
    console.warn(
      "GOOGLE_BOOKS_API_KEY no está definido. La búsqueda puede fallar o estar limitada."
    );
  }

  const query = normalizeQuery(rawQuery);
  // Include pagination params in cache key to avoid cache collisions
  const cacheKey = `${makeCacheKey(query)}:startIndex=${startIndex}:maxResults=${maxResults}`;
  const now = Date.now();

  // 0️⃣ Si hay una petición en vuelo, reusa su Promise
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey)!;
  }

  const promise = (async (): Promise<BookResult[]> => {
    // 1️⃣ Cache en memoria (Map)
    const mem = memoryCache.get(cacheKey);
    if (mem && mem.expiresAt > now) return mem.data as BookResult[];
    if (mem) memoryCache.delete(cacheKey); // entry expirada

    // 2️⃣ Cache Redis
    if (redis) {
      try {
        const cached = await redis.get(cacheKey);
        const parsed = safeParse<BookResult[]>(cached);
        if (parsed && Array.isArray(parsed)) {
          const memTtlSec = parsed.length === 0 ? EMPTY_TTL_SEC : CACHE_TTL_SEC;
          memoryCache.set(cacheKey, { data: parsed, expiresAt: now + memTtlSec * 1000 });
          if (memoryCache.size > MAX_MEM_ENTRIES) {
            const oldestKey = memoryCache.keys().next().value;
            if (oldestKey !== undefined) memoryCache.delete(oldestKey);
          }
          return parsed;
        }
      } catch (err) {
        redisFailureCount++;
        console.error("Redis get error:", err);
      }
    }

    // 3️⃣ Fetch desde Google Books (con timeout y chequeo de status)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${maxResults}${
        API_KEY ? `&key=${API_KEY}` : ""
      }`;
      const res = await fetch(url, { signal: controller.signal } as RequestInit);
      clearTimeout(timeout);

      if (!res.ok) {
        console.error(`Google Books API returned ${res.status} ${res.statusText}`);
        const shortExpiresAt = Date.now() + EMPTY_TTL_SEC * 1000;
        memoryCache.set(cacheKey, { data: [], expiresAt: shortExpiresAt });
        if (memoryCache.size > MAX_MEM_ENTRIES) {
          const oldestKey = memoryCache.keys().next().value;
          if (oldestKey !== undefined) memoryCache.delete(oldestKey);
        }
        // Removed Redis caching for Google Books data
        return [];
      }

      const data = (await res.json()) as { items?: any[] } | null;
      const items = data?.items || [];

      const results: BookResult[] = items.map((item: any) => ({
        id: item.id,
        titulo: item.volumeInfo?.title || "Título desconocido",
        autores: item.volumeInfo?.authors || [],
        descripcion: item.volumeInfo?.description || null,
        imagen: item.volumeInfo?.imageLinks?.thumbnail || null,
        enlace: item.volumeInfo?.infoLink || null,
      }));

      const memTtlSec = results.length === 0 ? EMPTY_TTL_SEC : CACHE_TTL_SEC;
      const expiresAt = Date.now() + memTtlSec * 1000;
      memoryCache.set(cacheKey, { data: results, expiresAt });
      if (memoryCache.size > MAX_MEM_ENTRIES) {
        const oldestKey = memoryCache.keys().next().value;
        if (oldestKey !== undefined) memoryCache.delete(oldestKey);
      }

      // Removed Redis caching for Google Books data

      return results;
    } catch (err: any) {
      clearTimeout(timeout);
      if (err?.name === "AbortError") {
        console.error("Fetch timed out for query:", query);
      } else {
        console.error("Error buscando libro:", err);
      }

      const shortExpiresAt = Date.now() + EMPTY_TTL_SEC * 1000;
      memoryCache.set(cacheKey, { data: [], expiresAt: shortExpiresAt });
      if (memoryCache.size > MAX_MEM_ENTRIES) {
        const oldestKey = memoryCache.keys().next().value;
        if (oldestKey !== undefined) memoryCache.delete(oldestKey);
      }

      // Removed Redis caching for Google Books data

      return [];
    } finally {
      clearTimeout(timeout);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  promise.finally(() => inFlightRequests.delete(cacheKey));

  return promise;
};
