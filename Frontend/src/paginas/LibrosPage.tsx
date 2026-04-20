import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import LibroCard from "../componentes/LibroCard";
import { getResenasByLibro } from "../services/resenaService";
import { buildApiUrl } from "../utils/apiHelpers";

interface Libro {
  id: string;
  titulo: string;
  autores: string[];
  descripcion?: string;
  imagen: string | null;
  enlace: string | null;
  averageRating?: number;
  slug?: string | null;
  externalId?: string | null;
}

interface LibroConPromedio extends Libro {
  averageRating: number;
}

const normalizeImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith('https://')) return url;
  if (url.startsWith('http://')) return url.replace('http://', 'https://');
  if (url.startsWith('//')) return `https:${url}`;
  return url;
};

const normalizeText = (value: string | null | undefined): string =>
  (value || '').trim().toLowerCase();

const getLibroRouteId = (libro: Partial<Libro>): string => {
  return String(libro.slug || libro.externalId || libro.id || '').trim();
};

const getLibroIdentityKey = (libro: Partial<Libro>): string => {
  const routeId = getLibroRouteId(libro);
  if (routeId) return `id:${routeId}`;

  const titulo = normalizeText(libro.titulo);
  const autorPrincipal = normalizeText((libro.autores || [])[0]);

  if (titulo && autorPrincipal) return `ta:${titulo}::${autorPrincipal}`;
  if (titulo) return `t:${titulo}`;

  return `fallback:${Math.random().toString(36).slice(2)}`;
};

const isUnknownAuthor = (author: string | undefined): boolean => {
  const value = normalizeText(author);
  return !value || value.includes('autor desconocido') || value.includes('unknown author');
};

const isBetterLibroCandidate = (next: Libro, current: Libro): boolean => {
  const nextAuthor = next.autores?.[0];
  const currentAuthor = current.autores?.[0];
  const nextHasKnownAuthor = !isUnknownAuthor(nextAuthor);
  const currentHasKnownAuthor = !isUnknownAuthor(currentAuthor);

  if (nextHasKnownAuthor !== currentHasKnownAuthor) {
    return nextHasKnownAuthor;
  }

  const nextHasImage = Boolean(next.imagen);
  const currentHasImage = Boolean(current.imagen);
  if (nextHasImage !== currentHasImage) {
    return nextHasImage;
  }

  const nextDescLen = (next.descripcion || '').length;
  const currentDescLen = (current.descripcion || '').length;
  if (nextDescLen !== currentDescLen) {
    return nextDescLen > currentDescLen;
  }

  return (next.averageRating || 0) >= (current.averageRating || 0);
};

const mergeLibroCandidates = (a: Libro, b: Libro): Libro => {
  const preferred = isBetterLibroCandidate(a, b) ? a : b;
  const secondary = preferred === a ? b : a;
  const preferredRating = preferred.averageRating || 0;
  const secondaryRating = secondary.averageRating || 0;

  return {
    ...secondary,
    ...preferred,
    id: preferred.id || secondary.id,
    slug: preferred.slug || secondary.slug || null,
    externalId: preferred.externalId || secondary.externalId || null,
    averageRating: preferredRating > 0 ? preferredRating : secondaryRating,
  };
};

const dedupeLibrosForDisplay = (items: Libro[]): Libro[] => {
  const bySemanticKey = new Map<string, Libro>();

  for (const libro of items) {
    const titleKey = normalizeText(libro.titulo);
    const authorKey = normalizeText(libro.autores?.[0]);
    const semanticKey = authorKey && !isUnknownAuthor(authorKey)
      ? `ta:${titleKey}::${authorKey}`
      : `t:${titleKey}`;

    const existing = bySemanticKey.get(semanticKey);
    if (!existing) {
      bySemanticKey.set(semanticKey, libro);
      continue;
    }

    bySemanticKey.set(semanticKey, mergeLibroCandidates(libro, existing));
  }

  return Array.from(bySemanticKey.values());
};

export default function TodosLosLibros() {
  const location = useLocation();
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load More
  const [pagina, setPagina] = useState<number>(1);
  const librosPorPagina = 8;
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number | null>(null);

  // Búsqueda y debounce
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(searchTerm);
  const [searchFilter, setSearchFilter] = useState<string>("todos");
  const debounceDelay = 300;
  const baseQuery = "subject:fantasy";

  // Hook para leer los parámetros de la URL
  const [searchParams] = useSearchParams();

  // Panel debug (visible en UI)
  const [lastUrl, setLastUrl] = useState<string | null>(null);
  const [lastCount, setLastCount] = useState<number | null>(null);
  const [lastStartIndex, setLastStartIndex] = useState<number | null>(null);

  // Ordenamiento
  const [sortOrder, setSortOrder] = useState<'relevance' | 'rating_high_to_low'>('relevance');

  // Debounce simple para searchTerm -> debouncedSearchTerm
  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, debounceDelay);
    return () => window.clearTimeout(id);
  }, [searchTerm]);

  // 2. useEffect para leer los parámetros de la URL (también cuando ya estamos en /libros y se cambia el query)
  useEffect(() => {
    const filtroFromURL = searchParams.get('filtro') || 'todos';
    const terminoFromURL = searchParams.get('termino') || '';

    setSearchFilter(filtroFromURL);
    setSearchTerm(terminoFromURL);
  }, [searchParams]);

  // Cuando cambia la búsqueda, el filtro o el orden, se resetea la paginación.
  useEffect(() => {
    setPagina(1);
    setLibros([]);
    setHasMore(true);
  }, [debouncedSearchTerm, searchFilter, sortOrder]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchTopRatedLocalBooks = async (): Promise<LibroConPromedio[]> => {
      try {
        const topRatedUrl = buildApiUrl('/libro/estrellas?minEstrellas=1');
        const topRatedRes = await fetch(topRatedUrl, { signal });
        if (!topRatedRes.ok) return [];

        const topRatedRaw = await topRatedRes.json();
        if (!Array.isArray(topRatedRaw)) return [];

        return topRatedRaw
          .map((libro: any) => {
            const avg = Number(libro.promedio_estrellas ?? 0);
            return {
              id: String(libro.externalId || libro.id || libro.slug || ''),
              titulo: libro.nombre || 'Sin título',
              autores: libro.autor_nombre ? [String(libro.autor_nombre)] : [],
              descripcion: libro.sinopsis || undefined,
              imagen: normalizeImageUrl(libro.imagen || null),
              enlace: libro.enlace || null,
              averageRating: Number.isFinite(avg) ? avg : 0,
              slug: libro.slug || null,
              externalId: libro.externalId || null,
            };
          })
          .filter((libro: LibroConPromedio) => Boolean(libro.id))
          .filter((libro: LibroConPromedio) => libro.averageRating > 0)
          .sort((a, b) => b.averageRating - a.averageRating);
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.warn('Error cargando top de libros calificados:', err);
        }
        return [];
      }
    };

    const fetchLibros = async () => {
      const isInitialLoad = pagina === 1;
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        // 🔍 BÚSQUEDA COMBINADA: Base de datos + Google Books
        let allItems: any[] = [];
        let total: number | null = null;
        let topRatedLocalBooks: LibroConPromedio[] = [];

        if (sortOrder === 'rating_high_to_low' && isInitialLoad) {
          topRatedLocalBooks = await fetchTopRatedLocalBooks();
        }

        // 1️⃣ Buscar en la base de datos local primero
        if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
          try {
            const localUrl = buildApiUrl(`/libro/search?query=${encodeURIComponent(debouncedSearchTerm)}`);
            const localRes = await fetch(localUrl, { signal });
            if (localRes.ok) {
              const localData = await localRes.json();
              const localLibros = Array.isArray(localData) ? localData : [];
              
              // Mapear libros de la BD al formato esperado
              const mappedLocal = localLibros.map((libro: any) => ({
                id: String(libro.externalId || libro.id || libro.slug || ''),
                titulo: libro.nombre || 'Sin título',
                autores: libro.autor ? [`${libro.autor.nombre} ${libro.autor.apellido}`] : [],
                descripcion: libro.sinopsis || undefined,
                imagen: normalizeImageUrl(libro.imagen || null),
                enlace: null,
                slug: libro.slug || null,
                externalId: libro.externalId || null,
                isLocal: true // Marcador para distinguir libros locales
              })).filter((libro: any) => Boolean(libro.id));
              
              allItems = mappedLocal;
            }
          } catch (localErr) {
            if ((localErr as any)?.name !== 'AbortError') {
              console.warn('Error buscando en BD local:', localErr);
            }
          }
        }

        // 2️⃣ Buscar en Google Books API
        // Construir query con prefijo según filtro seleccionado
        let q = "";
        if (debouncedSearchTerm && debouncedSearchTerm.length) {
          switch (searchFilter) {
            case "titulo":
              q = `intitle:${debouncedSearchTerm}`;
              break;
            case "autor":
              q = `inauthor:${debouncedSearchTerm}`;
              break;
            case "isbn":
              q = `isbn:${debouncedSearchTerm}`;
              break;
            case "tema":
              q = `subject:${debouncedSearchTerm}`;
              break;
            case "todos":
            default:
              q = debouncedSearchTerm;
              break;
          }
        } else {
          q = baseQuery;
        }

        const startIndex = (pagina - 1) * librosPorPagina;
        const cb = Date.now();
        const url = buildApiUrl(`/google-books/buscar?q=${encodeURIComponent(
          q
        )}&orderBy=relevance&maxResults=${librosPorPagina}&startIndex=${startIndex}&cb=${cb}`);

        // Guardar URL visible en UI para debug
        setLastUrl(url);
        setLastStartIndex(startIndex);

        const res = await fetch(url, { signal });
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        const raw = await res.json();

        // Soportar varios shapes: array directo o { items, totalItems } o wrappers comunes
        let items: any[] = [];

        if (Array.isArray(raw)) {
          items = raw;
        } else if (raw && Array.isArray(raw.items)) {
          items = raw.items;
          total = typeof raw.totalItems === "number" ? raw.totalItems : null;
        } else if (raw && Array.isArray(raw.results)) {
          items = raw.results;
        } else if (raw && Array.isArray(raw.books)) {
          items = raw.books;
        } else {
          items = [];
        }

        // Mapeo de libros de Google Books
        const mappedGoogleBooks: Libro[] = items.map((it: any, idx: number) => {
          return {
            id: it.id ?? it._id ?? `${pagina}-${idx}-${it.title ?? it.titulo ?? "no-id"}`,
            titulo: it.titulo ?? it.title ?? it.volumeInfo?.title ?? "Título desconocido",
            autores:
              it.autores ??
              it.authors ??
              (it.volumeInfo?.authors as string[] | undefined) ??
              [],
            descripcion:
              it.descripcion ?? it.description ?? it.volumeInfo?.description ?? undefined,
            imagen: normalizeImageUrl(
              it.imagen ??
              it.image ??
              it.volumeInfo?.imageLinks?.thumbnail ??
              it.volumeInfo?.imageLinks?.smallThumbnail ??
              null
            ),
            enlace: it.enlace ?? it.link ?? it.volumeInfo?.infoLink ?? null,
            slug: it.slug ?? null,
            externalId: it.externalId ?? it.id ?? it._id ?? null,
            isLocal: false
          };
        });

        // 3️⃣ Combinar resultados locales + Google Books
        allItems = [...allItems, ...mappedGoogleBooks];

        const dedupedItems = new Map<string, any>();
        for (const libro of allItems) {
          const key = getLibroIdentityKey(libro);
          if (!dedupedItems.has(key)) {
            dedupedItems.set(key, libro);
          }
        }
        allItems = Array.from(dedupedItems.values());

        if (sortOrder === 'rating_high_to_low' && isInitialLoad && topRatedLocalBooks.length > 0) {
          const topRatedIds = new Set(topRatedLocalBooks.map((libro) => String(libro.id)));
          const queryItemsSinDuplicados = allItems.filter((libro) => !topRatedIds.has(String(libro.id)));
          allItems = [...topRatedLocalBooks, ...queryItemsSinDuplicados];
        }

        // Always fetch ratings for all libros in parallel for hover display
        const ratingPromises = allItems.map(async (libro) => {
          try {
            const reviewsData = await getResenasByLibro(libro.id);
            const reviews = reviewsData?.reviews || [];
            const avgRating = reviews.length > 0
              ? reviews.reduce((sum: number, r: any) => sum + r.estrellas, 0) / reviews.length
              : 0;
            return { ...libro, averageRating: avgRating };
          } catch (err) {
            console.warn(`Error fetching ratings for ${libro.id}:`, err);
            return { ...libro, averageRating: libro.averageRating || 0 };
          }
        });
        const librosWithRatings = await Promise.all(ratingPromises);

        let finalLibros = librosWithRatings;
        if (sortOrder === 'rating_high_to_low') {
          if (isInitialLoad && topRatedLocalBooks.length > 0) {
            const topRatedIds = new Set(topRatedLocalBooks.map((libro) => String(libro.id)));
            const topRatedSection = librosWithRatings
              .filter((libro) => topRatedIds.has(String(libro.id)))
              .sort((a, b) => b.averageRating - a.averageRating);

            const querySection = librosWithRatings
              .filter((libro) => !topRatedIds.has(String(libro.id)))
              .sort((a, b) => {
                const aRated = a.averageRating > 0;
                const bRated = b.averageRating > 0;
                if (aRated && !bRated) return -1;
                if (!aRated && bRated) return 1;
                return b.averageRating - a.averageRating;
              });

            finalLibros = [...topRatedSection, ...querySection];
          } else {
            // En páginas siguientes solo se ordenan los resultados de la query.
            finalLibros = librosWithRatings.sort((a, b) => {
              const aRated = a.averageRating > 0;
              const bRated = b.averageRating > 0;
              if (aRated && !bRated) return -1;
              if (!aRated && bRated) return 1;
              return b.averageRating - a.averageRating;
            });
          }
        }

        finalLibros = dedupeLibrosForDisplay(finalLibros);

        if (isInitialLoad) {
          setLibros(finalLibros);
        } else {
          setLibros((prev) => [...prev, ...finalLibros]);
        }
        setTotalItems(total);
        setLastCount(finalLibros.length);

        // Lógica mejorada de hasMore:
        // - Si conocemos total -> comparo startIndex + fetched < total
        // - Si NO conocemos total -> asumimos que hay más si la API devolvió al menos 1 item.
        if (total !== null) {
          const fetchedCount = startIndex + items.length;
          setHasMore(fetchedCount < total);
        } else {
          // importante: si la API devolvió 0 items, no hay más; si devolvió >0, habilitamos "Siguiente" para que pruebes.
          setHasMore(items.length > 0);
        }

      } catch (err: any) {
        if (err?.name === "AbortError") {
          // request cancelado
          return;
        }
        setError(err?.message ?? "Error desconocido");
        if (pagina === 1) {
          setLibros([]);
        }
        setHasMore(false);
        setTotalItems(null);
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    };

    fetchLibros();
    return () => controller.abort();
  }, [debouncedSearchTerm, pagina, searchFilter, sortOrder]);

  // helper imagen válida
  const imagenValida = (img: string | null | undefined) =>
    !!img &&
    typeof img === "string" &&
    !img.toLowerCase().includes("image_not_available") &&
    !img.toLowerCase().includes("no_image") &&
    !img.toLowerCase().includes("nophoto");

  const totalPages = totalItems ? Math.ceil(totalItems / librosPorPagina) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 via-blue-600 to-indigo-700 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400">
              Explorador de Libros
            </span>
          </h2>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
          <div className="w-full sm:w-auto flex-shrink-0">
            <select
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full px-4 py-4 rounded-3xl border border-slate-200 dark:border-gray-600 shadow-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-600 focus:border-cyan-400 dark:focus:border-cyan-500 transition-all duration-300 text-gray-700 dark:text-gray-200 font-medium sm:min-w-[120px]"
            >
              <option value="todos">Todos</option>
              <option value="titulo">Título</option>
              <option value="autor">Autor</option>
              <option value="isbn">ISBN</option>
              <option value="tema">Tema</option>
            </select>
          </div>

          <div className="w-full sm:w-auto flex-shrink-0">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'relevance' | 'rating_high_to_low')}
              className="w-full px-4 py-4 rounded-3xl border border-slate-200 dark:border-gray-600 shadow-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-600 focus:border-cyan-400 dark:focus:border-cyan-500 transition-all duration-300 text-gray-700 dark:text-gray-200 font-medium sm:min-w-[140px]"
            >
              <option value="relevance">Relevancia</option>
              <option value="rating_high_to_low">Mejor Calificado</option>
            </select>
          </div>

          <div className="w-full max-w-2xl relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <svg className="w-5 h-5 text-cyan-500 dark:text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                <circle cx="11" cy="11" r="6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <input
              type="text"
              placeholder="Buscar libros (ej: tolkien, subject:fantasy, 978014...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-3xl border border-slate-200 dark:border-gray-600 shadow-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-600 focus:border-cyan-400 dark:focus:border-cyan-500 transition-all duration-300 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                title="Limpiar búsqueda"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4 text-slate-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {loading && libros.length === 0 && (
          <div className="flex justify-center items-center my-8">
            <DotLottieReact
              src="https://lottie.host/6d727e71-5a1d-461e-9434-c9e7eb1ae1d1/IWVmdeMHnT.lottie"
              loop
              autoplay
              style={{ width: 140, height: 140 }}
            />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400 text-xl font-semibold mb-2">¡Oops! Algo salió mal</p>
            <p className="text-gray-600 dark:text-gray-300 text-lg">{error}</p>
          </div>
        )}

        {!loading && !error && libros.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-gray-700 dark:text-gray-200 text-xl font-semibold mb-2">No se encontraron libros</p>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Intenta con otra búsqueda o términos diferentes</p>
          </div>
        )}

        {!error && libros.length > 0 && (
          <>
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {libros.map((libro) => {
                // Usar /libro/:slug para todos los libros (locales usan slug, externos usan externalId)
                const routeId = getLibroRouteId(libro);
                if (!routeId) return null;

                const libroUrl = `/libro/${routeId}`;
                
                return (
                  <Link key={`${routeId}-${libro.titulo}`} to={libroUrl} state={{ from: location.pathname }} className="block">
                    <LibroCard
                      title={libro.titulo}
                      authors={libro.autores}
                      image={libro.imagen}
                      description={libro.descripcion}
                      rating={libro.averageRating}
                    />
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-col items-center gap-4 mt-8">
              {loadingMore && (
                <div className="flex justify-center items-center my-4">
                  <DotLottieReact
                    src="https://lottie.host/6d727e71-5a1d-461e-9434-c9e7eb1ae1d1/IWVmdeMHnT.lottie"
                    loop
                    autoplay
                    style={{ width: 140, height: 140 }}
                  />
                </div>
              )}
              
              {hasMore && !loadingMore && (
                <button
                  onClick={() => setPagina((p) => p + 1)}
                  className="px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700 hover:from-cyan-600 hover:to-blue-700 dark:hover:from-cyan-700 dark:hover:to-blue-800"
                >
                  Cargar más libros
                </button>
              )}

              <div className="text-base text-gray-700 dark:text-gray-300 font-medium">
                {totalItems !== null && (
                  <span>{totalItems.toLocaleString()} resultados totales</span>
                )}
              </div>
            </div>
          </>
        )}

        {/* Panel debug en acordeón - comentado para no mostrar
        <details className="mt-6 max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100">
          <summary className="cursor-pointer p-6 text-lg font-semibold text-gray-800 hover:text-cyan-600 transition-colors duration-200 flex items-center justify-between">
            <span>🔧 Panel de Debug</span>
            <svg className="w-5 h-5 transform transition-transform duration-200 details-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>

          <div className="px-6 pb-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-between mb-4">
              <div className="flex-1">
                <h4 className="font-semibold text-base mb-3 text-gray-800">📡 Información de Requests</h4>
                <div className="space-y-2 text-sm">
                  <div><strong className="text-gray-600">Last URL:</strong> <code className="break-all bg-gray-50 px-2 py-1 rounded text-xs font-mono">{lastUrl ?? "—"}</code></div>
                  <div><strong className="text-gray-600">startIndex:</strong> <span className="bg-blue-50 px-2 py-1 rounded text-xs font-mono">{lastStartIndex ?? "—"}</span></div>
                  <div><strong className="text-gray-600">Últimos items devueltos:</strong> <span className="bg-green-50 px-2 py-1 rounded text-xs font-mono">{lastCount ?? "—"}</span></div>
                </div>
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-base mb-3 text-gray-800">⚙️ Estado de la Aplicación</h4>
                <div className="space-y-2 text-sm">
                  <div><strong className="text-gray-600">loading:</strong> <span className={`px-2 py-1 rounded text-xs font-mono ${loading ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>{String(loading)}</span></div>
                  <div><strong className="text-gray-600">hasMore:</strong> <span className={`px-2 py-1 rounded text-xs font-mono ${hasMore ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{String(hasMore)}</span></div>
                  <div><strong className="text-gray-600">totalItems:</strong> <span className="bg-purple-50 px-2 py-1 rounded text-xs font-mono">{totalItems ?? "—"}</span></div>
                  <div><strong className="text-gray-600">query usada:</strong> <code className="break-all bg-indigo-50 px-2 py-1 rounded text-xs font-mono">{debouncedSearchTerm || baseQuery}</code></div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800 leading-relaxed">
                💡 <strong>Consejo:</strong> Si el botón "Cargar más libros" queda deshabilitado aún cuando esperás más resultados,
                lo más probable es que tu backend esté ignorando el parámetro <code className="bg-white px-1 rounded">startIndex</code> o devolviendo siempre la misma lista.
                Copiá la <strong>Last URL</strong> y probala en el navegador (o en Postman) para ver la respuesta que está devolviendo el servidor.
              </p>
            </div>
          </div>
        </details>
        */}
      </main>
    </div>
  );
}
