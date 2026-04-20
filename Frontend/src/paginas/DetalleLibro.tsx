import React, { useState, useEffect, useMemo, useReducer, useRef } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Star,
  Heart,
  Plus,
  ArrowLeft,
  BookOpen,
  MessageCircle,
  Award,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  MoreHorizontal,
  Loader2,
  User,
} from "lucide-react";
import { getResenasByLibro, agregarReseña, crearRespuesta, obtenerResenasPopulares, editarResena, eliminarResena } from "../services/resenaService";
import { addOrUpdateReaccion, deleteReaccion } from "../services/reaccionService";
import { isAuthenticated, getToken, getUserIdFromToken } from "../services/authService";
import { listaService, Lista } from "../services/listaService";
import { obtenerFavoritos, agregarFavorito, quitarFavorito } from "../services/favoritosService";
import { ModerationErrorModal } from "../componentes/ModerationErrorModal";
import LibroImagen from "../componentes/LibroImagen";
import { LISTA_NOMBRES, LISTA_TIPOS } from "../constants/listas";
import { buildApiUrl } from "../utils/apiHelpers";

interface Libro {
  id: string;
  titulo: string;
  title?: string;
  autores: string[];
  autorId?: number | null; // ID del autor local si existe
  descripcion: string | null;
  imagen: string | null;
  coverUrl?: string | null;
  enlace: string | null;
  slug?: string;
  activities_count?: number;
  source: "hardcover" | "google" | "local" | "bookcode";
}

interface Reseña {
  id: number;
  comentario: string;
  estrellas: number;
  estado: string;
  fechaResena: string;
  usuario: {
    id: number;
    username: string;
    nombre?: string;
    avatar?: string;
  };
  reacciones?: { id: number; tipo: string; usuarioId?: number }[];
  reaccionesCount?: {
    likes: number;
    dislikes: number;
    corazones: number;
    total: number;
  };
  respuestas?: Reseña[];
  resenaPadre?: { usuario: { id?: number; nombre?: string; username: string } };
}

// Estado para useReducer
interface ReviewState {
  reseñas: Reseña[];
  averageRating: number | null;
  likedByUser: Record<number, boolean>;
  dislikedByUser: Record<number, boolean>;
  expandedReviewIds: Record<number, boolean>;
  expandedReplies: Record<string, boolean>;
  replyForms: Record<number, { comentario: string; submitting: boolean; error: string | null } | null>;
  sortOrder: 'mas_recientes' | 'mejor_valoradas' | 'mas_populares';
  reviewsLoading: boolean;
}

type ReviewAction =
  | { type: 'SET_REVIEWS'; payload: Reseña[] }
  | { type: 'SET_AVERAGE_RATING'; payload: number | null }
  | { type: 'SET_LIKED_BY_USER'; payload: Record<number, boolean> }
  | { type: 'SET_DISLIKED_BY_USER'; payload: Record<number, boolean> }
  | { type: 'TOGGLE_EXPAND_REVIEW'; payload: number }
  | { type: 'TOGGLE_EXPAND_REPLIES'; payload: string }
  | { type: 'SET_REPLY_FORM'; payload: { reviewId: number; form: { comentario: string; submitting: boolean; error: string | null } | null } }
  | { type: 'SET_SORT_ORDER'; payload: 'mas_recientes' | 'mejor_valoradas' | 'mas_populares' }
  | { type: 'SET_REVIEWS_LOADING'; payload: boolean }
  | { type: 'UPDATE_REVIEW_REACTIONS'; payload: { reviewId: number; reacciones: { id: number; tipo: string; usuarioId?: number }[] } };

const reviewReducer = (state: ReviewState, action: ReviewAction): ReviewState => {
  switch (action.type) {
    case 'SET_REVIEWS':
      return { ...state, reseñas: action.payload };
    case 'SET_AVERAGE_RATING':
      return { ...state, averageRating: action.payload };
    case 'SET_LIKED_BY_USER':
      return { ...state, likedByUser: action.payload };
    case 'SET_DISLIKED_BY_USER':
      return { ...state, dislikedByUser: action.payload };
    case 'TOGGLE_EXPAND_REVIEW':
      return { ...state, expandedReviewIds: { ...state.expandedReviewIds, [action.payload]: !state.expandedReviewIds[action.payload] } };
    case 'TOGGLE_EXPAND_REPLIES':
      return { ...state, expandedReplies: { ...state.expandedReplies, [action.payload]: !state.expandedReplies[action.payload] } };
    case 'SET_REPLY_FORM':
      return { ...state, replyForms: { ...state.replyForms, [action.payload.reviewId]: action.payload.form } };
    case 'SET_SORT_ORDER':
      return { ...state, sortOrder: action.payload };
    case 'SET_REVIEWS_LOADING':
      return { ...state, reviewsLoading: action.payload };
    case 'UPDATE_REVIEW_REACTIONS':
      return {
        ...state,
        reseñas: state.reseñas.map(r =>
          r.id === action.payload.reviewId ? { ...r, reacciones: action.payload.reacciones } : r
        )
      };
    default:
      return state;
  }
};

// Componente para links de autores (con verificación de existencia en BD y fallback a APIs externas)
const AutorLink: React.FC<{ nombreCompleto: string; autorId?: number | null }> = ({ nombreCompleto, autorId: autorIdProp }) => {
  const [autorId, setAutorId] = useState<number | null>(autorIdProp || null);
  const [autorExterno, setAutorExterno] = useState<any>(null);
  const [loading, setLoading] = useState(!autorIdProp); // Si ya tenemos ID, no cargar

  useEffect(() => {
    // Si ya tenemos el ID del autor, no buscar
    if (autorIdProp) {
      setAutorId(autorIdProp);
      setLoading(false);
      return;
    }

    const buscarAutor = async () => {
      try {
        // 1️⃣ Primero: Buscar en BD local
        const responseBD = await fetch(
          buildApiUrl(`/autor/search?q=${encodeURIComponent(nombreCompleto)}&includeExternal=false`)
        );
        
        if (responseBD.ok) {
          const autores = await responseBD.json();
          // Buscar coincidencia exacta en el array de resultados
          const autorExacto = autores.find((a: any) => {
            const nombreAutor = `${a.nombre} ${a.apellido}`.trim().toLowerCase();
            return nombreAutor === nombreCompleto.toLowerCase();
          });
          
          if (autorExacto) {
            console.log('✅ Autor encontrado en BD:', autorExacto);
            setAutorId(autorExacto.id);
            setLoading(false);
            return; // Salir si encontramos en BD
          }
        }

        // 2️⃣ Fallback: Buscar en Google Books si no está en BD
        console.log('🔍 Autor no encontrado en BD, buscando en APIs externas:', nombreCompleto);
        const responseExterno = await fetch(
          buildApiUrl(`/autor/search?q=${encodeURIComponent(nombreCompleto)}&includeExternal=true`)
        );
        
        if (responseExterno.ok) {
          const autoresExternos = await responseExterno.json();
          // Buscar coincidencia exacta o aproximada
          const autorExternoExacto = autoresExternos.find((a: any) => {
            if (a.external) {
              const nombreAutor = a.name?.trim().toLowerCase() || '';
              return nombreAutor === nombreCompleto.toLowerCase();
            }
            return false;
          });
          
          if (autorExternoExacto) {
            console.log('✅ Autor encontrado en API externa:', autorExternoExacto);
            setAutorExterno(autorExternoExacto);
          }
        }
      } catch (error) {
        console.log('❌ Error al buscar el autor:', nombreCompleto, error);
      } finally {
        setLoading(false);
      }
    };

    buscarAutor();
  }, [nombreCompleto, autorIdProp]);

  if (loading) {
    return (
      <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 rounded-full shadow-md text-base font-semibold text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700">
        <User className="w-4 h-4 animate-pulse" />
        {nombreCompleto}
      </span>
    );
  }

  // Si existe en BD, enlazar a perfil interno
  if (autorId) {
    return (
      <Link
        to={`/autores/${autorId}`}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-xl text-base font-semibold text-gray-700 dark:text-slate-200 hover:text-cyan-700 dark:hover:text-cyan-400 transition-all duration-200 border border-gray-200 dark:border-slate-700 hover:scale-105"
      >
        <User className="w-4 h-4" />
        {nombreCompleto}
      </Link>
    );
  }

  // Si existe en API externa, enlazar a DetalleAutor pasando el nombre como parámetro
  // La página DetalleAutor ya maneja búsqueda en APIs externas
  if (autorExterno) {
    return (
      <Link
        to={`/autores/${encodeURIComponent(nombreCompleto)}`}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-xl text-base font-semibold text-gray-700 dark:text-slate-200 hover:text-cyan-700 dark:hover:text-cyan-400 transition-all duration-200 border border-gray-200 dark:border-slate-700 hover:scale-105"
        title="Ver perfil del autor (información de Google Books)"
      >
        <User className="w-4 h-4" />
        {nombreCompleto}
        <span className="text-xs opacity-60">📚</span>
      </Link>
    );
  }

  // Si no existe en ningún lado, igual permitir hacer clic para buscar en DetalleAutor
  // DetalleAutor intentará buscar en Google Books y Wikipedia
  return (
    <Link
      to={`/autores/${encodeURIComponent(nombreCompleto)}`}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-xl text-base font-semibold text-gray-600 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-400 transition-all duration-200 border border-gray-200 dark:border-slate-700 hover:scale-105"
      title="Buscar información del autor"
    >
      <User className="w-4 h-4" />
      {nombreCompleto}
    </Link>
  );
};

// Componente para renderizar avatar con link opcional al perfil
const UserAvatar: React.FC<{ 
  usuario: { id?: number; nombre?: string; username: string; avatar?: string }; 
  size?: string;
  clickable?: boolean;
  currentUserId?: number | null;
}> = ({ usuario, size = "w-14 h-14", clickable = true, currentUserId = null }) => {
  // Determinar la fuente del avatar
  const getAvatarSrc = () => {
    if (!usuario.avatar) return null;
    
    // Si es una URL completa (http/https), usarla directamente
    if (usuario.avatar.startsWith('http://') || usuario.avatar.startsWith('https://')) {
      return usuario.avatar;
    }
    
    // Si tiene extensión, usar directamente desde assets
    if (usuario.avatar.includes('.')) {
      return `/assets/${usuario.avatar}`;
    }
    
    // Si no tiene extensión, asumir .svg
    return `/assets/${usuario.avatar}.svg`;
  };

  const avatarSrc = getAvatarSrc();

  const avatarContent = avatarSrc ? (
    <img
      src={avatarSrc}
      alt={`Avatar de ${usuario.username || usuario.nombre}`}
      className={`${size} rounded-full object-cover`}
      onError={(e) => {
        // Si falla la carga, mostrar placeholder
        e.currentTarget.style.display = 'none';
        if (e.currentTarget.nextElementSibling) {
          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
        }
      }}
    />
  ) : (
    <div className={`${size} rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-bold text-lg`}>
      {((usuario.nombre || usuario.username) || "?")
        .split(" ")
        .map(s => s[0]?.toUpperCase() || "?")
        .slice(0, 2)
        .join("")}
    </div>
  );

  // Agregar div de fallback si hay imagen
  const contentWithFallback = avatarSrc ? (
    <>
      {avatarContent}
      <div className={`${size} rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-bold text-lg`} style={{ display: 'none' }}>
        {((usuario.nombre || usuario.username) || "?")
          .split(" ")
          .map(s => s[0]?.toUpperCase() || "?")
          .slice(0, 2)
          .join("")}
      </div>
    </>
  ) : avatarContent;

  // Si es clickable, no es el usuario actual y tiene ID, envolver en Link
  if (clickable && usuario.id && usuario.id !== currentUserId) {
    return (
      <Link to={`/perfil/${usuario.id}`} className="hover:opacity-80 transition-opacity">
        {contentWithFallback}
      </Link>
    );
  }

  return contentWithFallback;
};

// Componente para mostrar contadores de reacciones
const ReaccionContadores: React.FC<{ reaccionesCount?: { likes: number; dislikes: number; corazones: number; total: number } }> = ({ reaccionesCount }) => {
  if (!reaccionesCount) return null;

  const { likes, dislikes, corazones } = reaccionesCount;
  
  // Solo mostrar si hay al menos una reacción
  if (likes === 0 && dislikes === 0 && corazones === 0) return null;

  return (
    <div className="flex items-center gap-4 text-sm">
      {likes > 0 && (
        <div className="flex items-center gap-1.5 text-green-600">
          <ThumbsUp className="w-4 h-4" />
          <span className="font-medium">{likes}</span>
        </div>
      )}
      {corazones > 0 && (
        <div className="flex items-center gap-1.5 text-red-500">
          <Heart className="w-4 h-4 fill-current" />
          <span className="font-medium">{corazones}</span>
        </div>
      )}
      {dislikes > 0 && (
        <div className="flex items-center gap-1.5 text-gray-500">
          <ThumbsDown className="w-4 h-4" />
          <span className="font-medium">{dislikes}</span>
        </div>
      )}
    </div>
  );
};

// Estado inicial para useReducer
const initialReviewState: ReviewState = {
  reseñas: [],
  averageRating: null,
  likedByUser: {},
  dislikedByUser: {},
  expandedReviewIds: {},
  expandedReplies: {},
  replyForms: {},
  sortOrder: 'mas_recientes',
  reviewsLoading: false,
};

const DetalleLibro: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Helper para obtener el ID del usuario actual
  const getCurrentUserId = (): number | null => {
    const fromToken = getUserIdFromToken();
    if (fromToken) return fromToken;

    const userIdRaw = localStorage.getItem('userId') || localStorage.getItem('id');
    if (userIdRaw) {
      const parsed = Number(userIdRaw);
      if (!Number.isNaN(parsed) && parsed > 0) return parsed;
    }

    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        const parsed = Number(user?.id);
        if (!Number.isNaN(parsed) && parsed > 0) return parsed;
      } catch {
        // noop
      }
    }

    return null;
  };
  
  // ⬅ Función para volver a la página anterior
  const handleGoBack = () => {
    // Si hay historial previo en el navegador, usar navigate(-1)
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback si no hay historial
      navigate('/libros');
    }
  };

  const [libro, setLibro] = useState<Libro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [esFavorito, setEsFavorito] = useState<number | null>(null);
  const [mostrarSinopsis, setMostrarSinopsis] = useState(false);
  const [showListaDropdown, setShowListaDropdown] = useState(false);
  const [listas, setListas] = useState<Lista[]>([]);
  const [listasConLibro, setListasConLibro] = useState<Set<number>>(new Set());
  const [imageLoaded, setImageLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Estado para modal de error de moderación
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [moderationError, setModerationError] = useState<{
    message: string;
    details?: {
      score?: number;
      reasons?: string[];
      autoRejected?: boolean;
    };
  } | null>(null);
  const [openReviewMenuKey, setOpenReviewMenuKey] = useState<string | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editingIsReply, setEditingIsReply] = useState(false);
  const [editingComentario, setEditingComentario] = useState("");
  const [editingEstrellas, setEditingEstrellas] = useState(5);
  const [reviewActionLoading, setReviewActionLoading] = useState(false);
  const reviewMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openReviewMenuKey) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (reviewMenuRef.current && !reviewMenuRef.current.contains(event.target as Node)) {
        setOpenReviewMenuKey(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openReviewMenuKey]);

  // Función para detectar si el texto contiene etiquetas HTML
  const hasHtmlTags = (text: string) => /<[^>]*>/.test(text);

  // Función para obtener la longitud del texto plano (sin etiquetas HTML)
  const plainTextLength = (text: string) => text.replace(/<[^>]*>/g, '').length;

  // Función para renderizar la sinopsis
  const renderSinopsis = (descripcion: string | null) => {
    if (!descripcion) return null;
    const isHtml = hasHtmlTags(descripcion);
    if (isHtml) {
      return <span dangerouslySetInnerHTML={{ __html: descripcion }} />;
    } else {
      return <span>{descripcion}</span>;
    }
  };

  const nombresDeListasFijas: string[] = [LISTA_NOMBRES.TO_READ, LISTA_NOMBRES.PENDING, LISTA_NOMBRES.READ];

  // Filtra las listas del usuario para mostrar solo las que NO son fijas
  const listasPersonalizadas = listas.filter(l => !nombresDeListasFijas.includes(l.nombre));

  const handleToggleInList = async (lista: Lista) => {
    if (!libro) return;

    const yaEstaEnLista = listasConLibro.has(lista.id);
    const libroId = libro.id; // Ya sabemos que es un string

    // Snapshot for revert
    const prevListasConLibro = new Set(listasConLibro);

    try {
      if (yaEstaEnLista) {
        // Si ya está, lo quitamos
        await listaService.removeLibroDeLista(lista.id, libroId);
        // Actualizamos el estado local para desmarcar el checkbox
        setListasConLibro(prevSet => {
          const newSet = new Set(prevSet);
          newSet.delete(lista.id);
          return newSet;
        });
      } else {
        // Si no está, lo agregamos
        await listaService.addLibroALista(lista.id, libro);
        // Actualizamos el estado local para marcar el checkbox
        setListasConLibro(prevSet => {
          const newSet = new Set(prevSet);
          newSet.add(lista.id);
          return newSet;
        });
      }
    } catch (error) {
      console.error("Error al actualizar la lista:", error);
      alert("No se pudo actualizar la lista. Inténtalo de nuevo.");
      // Revert on error
      setListasConLibro(prevListasConLibro);
    }
  };

  const [reviewState, dispatch] = useReducer(reviewReducer, initialReviewState);

  useEffect(() => {
    const fetchLibro = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);

      try {
        let response;
        let data: any = null;

        // 🆕 PRIORIDAD 1: Intentar buscar en base de datos local primero
        response = await fetch(buildApiUrl(`/libro/slug/${slug}`));
        
        if (response.ok) {
          // ✅ Libro encontrado en base de datos local
          data = await response.json();
          
          // ✅ Validar y preservar el source original para evitar duplicados
          const validSource = (data.source === "hardcover" || data.source === "google" || data.source === "local" || data.source === "bookcode") 
            ? data.source 
            : "local"; // Si no tiene source válido, tratarlo como libro local de la BD
          
          // ✅ CRÍTICO: Usar externalId si existe, sino usar id
          const libroId = data.externalId || data.id.toString();
          
          console.log('📚 Libro cargado desde BD:', { 
            id: libroId,
            internalId: data.id,
            externalId: data.externalId,
            source: validSource,
            originalSource: data.source 
          });

          setLibro({
            id: libroId,
            titulo: data.titulo || data.title,
            title: data.titulo || data.title,
            autores: data.autores?.length ? data.autores : ["Autor desconocido"],
            autorId: data.autorId || null, // ✅ NUEVO: ID del autor local
            descripcion: data.descripcion || "No hay descripción disponible.",
            imagen: data.imagen || data.coverUrl,
            coverUrl: data.imagen || data.coverUrl,
            enlace: data.enlace || null,
            slug: data.slug,
            activities_count: data.activities_count,
            source: validSource,
          });
        } else {
          // 🔄 FALLBACK 1: Intentar Hardcover API
          response = await fetch(buildApiUrl(`/hardcover/libro/${slug}`));
          
          if (response.ok) {
            data = await response.json();
            setLibro({
              id: data.id.toString(),
              titulo: data.title,
              title: data.title,
              autores: data.authors?.length ? data.authors : ["Autor desconocido"],
              descripcion: data.description || "No hay descripción disponible.",
              imagen: data.coverUrl,
              coverUrl: data.coverUrl,
              enlace: null,
              slug: data.slug,
              activities_count: data.activities_count,
              source: "hardcover",
            });
          } else {
            // 🔄 FALLBACK 2: Intentar Google Books API
            response = await fetch(buildApiUrl(`/google-books/${slug}`));
            if (!response.ok) {
              const searchQuery = slug.replace(/-/g, " ");
              response = await fetch(
                buildApiUrl(`/google-books/buscar?q=${encodeURIComponent(searchQuery)}&maxResults=1`)
              );
              if (!response.ok) throw new Error("Libro no encontrado");

              const searchData = await response.json();
              if (searchData && searchData.length > 0) {
                const libroGoogle = searchData[0];
                data = libroGoogle;
                setLibro({
                  id: libroGoogle.id,
                  titulo: libroGoogle.title || "Título desconocido",
                  title: libroGoogle.title,
                  autores: libroGoogle.autores?.length ? libroGoogle.autores : ["Autor desconocido"],
                  descripcion: libroGoogle.descripcion || "No hay descripción disponible.",
                  imagen: libroGoogle.imagen || null,
                  coverUrl: libroGoogle.imagen || null,
                  enlace: libroGoogle.enlace || null,
                  slug: libroGoogle.slug || undefined,
                  activities_count: libroGoogle.activities_count,
                  source: "google",
                });
              } else throw new Error("Libro no encontrado");
            } else {
              const libroData = await response.json();
              data = libroData;
              setLibro({ ...libroData, source: "google" });
            }
          }
        }

        // ahora que tenemos data (si existe id/string), buscamos reseñas y rating usando el id que vino en "data" o en la respuesta
        const libroIdCandidate = data?.id ?? (data && data.id ? data.id : undefined);
        console.log("🔍 Libro ID candidato para buscar reseñas:", libroIdCandidate);
        console.log("🔍 Data completa:", data);
        if (libroIdCandidate) {
          dispatch({ type: 'SET_REVIEWS_LOADING', payload: true });
          try {
            console.log("🔍 Llamando a getResenasByLibro con ID:", libroIdCandidate);
            const reviewsData = await getResenasByLibro(libroIdCandidate);
            
            console.log("📚 Datos de reseñas recibidos:", reviewsData);
            
            // Filtrar: mostrar todo excepto flagged (rechazadas)
            const reviews = reviewsData?.reviews || reviewsData || [];
            console.log("📝 Total de reseñas antes de filtrar:", reviews.length);
            console.log("📋 Estados de reseñas:", reviews.map((r: Reseña) => ({ id: r.id, estado: r.estado })));
            
            const filtered = reviews.filter((r: Reseña) => r.estado !== "flagged");
            console.log("✅ Reseñas después de filtrar flagged:", filtered.length);

            dispatch({ type: 'SET_REVIEWS', payload: filtered });

            // Inicializar likedByUser y dislikedByUser si hay token
            const token = getToken();
            const userId = token ? getUserIdFromToken(token) : 0;
            console.log("🔍 Inicializando likes/dislikes - userId:", userId);
            const likedMap: Record<number, boolean> = {};
            const dislikedMap: Record<number, boolean> = {};
            filtered.forEach((r: Reseña) => {
              // Verificar like/dislike en reseña principal
              console.log(`📝 Reseña ${r.id} - reacciones:`, r.reacciones);
              if (r.reacciones?.some((rec: { id: number; tipo: string; usuarioId?: number }) => rec.tipo === "like" && (rec.usuarioId ?? 0) === userId)) {
                console.log(`✅ Usuario ${userId} tiene LIKE en reseña ${r.id}`);
                likedMap[r.id] = true;
              }
              if (r.reacciones?.some((rec: { id: number; tipo: string; usuarioId?: number }) => rec.tipo === "dislike" && (rec.usuarioId ?? 0) === userId)) {
                console.log(`✅ Usuario ${userId} tiene DISLIKE en reseña ${r.id}`);
                dislikedMap[r.id] = true;
              }
              // Verificar likes/dislikes en respuestas anidadas
              r.respuestas?.forEach(resp => {
                console.log(`📝 Respuesta ${resp.id} - reacciones:`, resp.reacciones);
                if (resp.reacciones?.some((rec: { id: number; tipo: string; usuarioId?: number }) => rec.tipo === "like" && (rec.usuarioId ?? 0) === userId)) {
                  console.log(`✅ Usuario ${userId} tiene LIKE en respuesta ${resp.id}`);
                  likedMap[resp.id] = true;
                }
                if (resp.reacciones?.some((rec: { id: number; tipo: string; usuarioId?: number }) => rec.tipo === "dislike" && (rec.usuarioId ?? 0) === userId)) {
                  console.log(`✅ Usuario ${userId} tiene DISLIKE en respuesta ${resp.id}`);
                  dislikedMap[resp.id] = true;
                }
              });
            });
            console.log("🎯 Mapa de likes inicializado:", likedMap);
            console.log("🎯 Mapa de dislikes inicializado:", dislikedMap);
            dispatch({ type: 'SET_LIKED_BY_USER', payload: likedMap });
            dispatch({ type: 'SET_DISLIKED_BY_USER', payload: dislikedMap });

            // Calculate average rating from parent reviews only
            const calculatedAvg = filtered.length > 0
              ? filtered.reduce((sum: number, r: Reseña) => sum + r.estrellas, 0) / filtered.length
              : 0;
            dispatch({ type: 'SET_AVERAGE_RATING', payload: calculatedAvg });
          } catch (reviewError) {
            console.warn("Error fetching reviews:", reviewError);
            dispatch({ type: 'SET_REVIEWS', payload: [] });
            dispatch({ type: 'SET_AVERAGE_RATING', payload: 0 });
          } finally {
            dispatch({ type: 'SET_REVIEWS_LOADING', payload: false });
          }
        }
      } catch (err: any) {
        setError(err.message || "Error al cargar el libro");
      } finally {
        setLoading(false);
      }
    };

    fetchLibro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    const fetchListas = async () => {
      if (!isAuthenticated()) return;
      try {
        const listasData = await listaService.getUserListas();
        setListas(listasData);
      } catch (error) {
        console.error("Error fetching listas:", error);
      }
    };
    fetchListas();
  }, []);

  useEffect(() => {
    const fetchFavoritoStatus = async () => {
      if (!isAuthenticated() || !libro) return;
      try {
        const favoritos = await obtenerFavoritos();
        console.log('🔍 Buscando favorito para libro:', { 
          libroId: libro.id, 
          libroSource: libro.source,
          favoritos: favoritos.map(f => ({ id: f.id, externalId: f.externalId, source: f.source }))
        });
        
        // Buscar el favorito usando externalId Y source
        // El libro puede tener como id:
        // 1. Un externalId de Google/Hardcover (string)
        // 2. Un ID numérico interno (cuando viene de la BD)
        const fav = favoritos.find(fav => 
          (fav.externalId === libro.id && fav.source === libro.source) ||
          (fav.externalId === libro.id.toString() && fav.source === libro.source)
        );
        
        console.log('✅ Favorito encontrado:', fav ? { id: fav.id, externalId: fav.externalId } : 'No encontrado');
        setEsFavorito(fav ? fav.id : null);
      } catch (error) {
        console.error("Error fetching favorito status:", error);
      }
    };
    fetchFavoritoStatus();
  }, [libro]);

  useEffect(() => {
    const fetchListasDelLibro = async () => {
      if (!libro?.id) return; // Si no hay libro, no hagas nada

      try {
        const ids = await listaService.getListasContainingBook(libro.id);
        setListasConLibro(new Set(ids)); // Guarda los IDs en el estado
      } catch (error) {
        console.error("Error al verificar las listas del libro:", error);
      }
    };

    fetchListasDelLibro();
  }, [libro]); // Se ejecuta cada vez que el libro cambie

  // useEffect para cerrar el dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowListaDropdown(false);
      }
    };

    if (showListaDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showListaDropdown]);

  // useEffect para recargar reseñas cuando cambia el orden
  useEffect(() => {
    const fetchResenasConOrden = async () => {
      if (!libro?.id) return;

      dispatch({ type: 'SET_REVIEWS_LOADING', payload: true });
      try {
        let reviewsData;
        
        if (reviewState.sortOrder === 'mas_populares') {
          // Cargar reseñas populares desde el endpoint especial
          reviewsData = await obtenerResenasPopulares(libro.id, 50);
        } else {
          // Cargar todas las reseñas y ordenar en frontend
          reviewsData = await getResenasByLibro(libro.id);
        }

        console.log("🔀 Cambio de orden - Datos recibidos:", reviewsData);
        const reviews = reviewsData?.reviews || reviewsData || [];
        console.log("🔀 Cambio de orden - Total reseñas:", reviews.length);
        const filtered = reviews.filter((r: Reseña) => r.estado !== "flagged");
        console.log("🔀 Cambio de orden - Reseñas filtradas:", filtered.length);

        dispatch({ type: 'SET_REVIEWS', payload: filtered });

        // Actualizar likedByUser
        const token = getToken();
        const userId = token ? getUserIdFromToken(token) : 0;
        const likedMap: Record<number, boolean> = {};
        filtered.forEach((r: Reseña) => {
          // Verificar like en reseña principal
          if (r.reacciones?.some((rec: { id: number; tipo: string; usuarioId?: number }) => rec.tipo === "like" && (rec.usuarioId ?? 0) === userId)) {
            likedMap[r.id] = true;
          }
          // Verificar likes en respuestas anidadas
          r.respuestas?.forEach(resp => {
            if (resp.reacciones?.some((rec: { id: number; tipo: string; usuarioId?: number }) => rec.tipo === "like" && (rec.usuarioId ?? 0) === userId)) {
              likedMap[resp.id] = true;
            }
          });
        });
        dispatch({ type: 'SET_LIKED_BY_USER', payload: likedMap });

        // Actualizar rating promedio
        const calculatedAvg = filtered.length > 0
          ? filtered.reduce((sum: number, r: Reseña) => sum + r.estrellas, 0) / filtered.length
          : 0;
        dispatch({ type: 'SET_AVERAGE_RATING', payload: calculatedAvg });
      } catch (error) {
        console.error("Error al cargar reseñas:", error);
      } finally {
        dispatch({ type: 'SET_REVIEWS_LOADING', payload: false });
      }
    };

    fetchResenasConOrden();
  }, [reviewState.sortOrder, libro]);

  const toggleFavorito = async () => {
    if (!isAuthenticated()) {
      alert("Debes iniciar sesión para gestionar favoritos.");
      return;
    }
    if (!libro) return;

    try {
      if (esFavorito) {
        await quitarFavorito(esFavorito);
        setEsFavorito(null);
      } else {
        // ✅ Validar que el source sea válido para evitar duplicados
        const validSource = (libro.source === "hardcover" || libro.source === "google" || libro.source === "local" || libro.source === "bookcode") 
          ? libro.source 
          : "local"; // Fallback a local si viene de la BD sin source válido

        console.log('🔍 Agregando a favoritos:', { 
          id: libro.id, 
          source: validSource,
          originalSource: libro.source 
        });

        const favoriteId = await agregarFavorito({
          id: libro.id,
          titulo: libro.titulo,
          autores: libro.autores, // ✅ Agregar autores
          descripcion: libro.descripcion,
          imagen: libro.imagen,
          enlace: libro.enlace,
          source: validSource,
        });
        setEsFavorito(favoriteId);
      }
    } catch (error: any) {
      console.error("Error toggling favorito:", error);
      
      // Manejar error 409 (Conflict) - el libro ya está en favoritos
      if (error.response?.status === 409) {
        alert("Este libro ya está en tus favoritos.");
        // Refrescar el estado de favoritos
        const favoritos = await obtenerFavoritos();
        console.log('🔄 Refrescando favoritos después de error 409:', favoritos);
        
        // Buscar el favorito existente
        const fav = favoritos.find(fav => 
          (fav.externalId === libro.id && fav.source === libro.source) ||
          (fav.externalId === libro.id.toString() && fav.source === libro.source)
        );
        
        if (fav) {
          console.log('✅ Favorito encontrado después de error 409:', fav.id);
          setEsFavorito(fav.id);
        } else {
          // Si el backend devuelve el ID del favorito en el error, usarlo
          const favoritoId = error.response?.data?.favoritoId;
          if (favoritoId) {
            console.log('✅ Usando favorito ID del error:', favoritoId);
            setEsFavorito(favoritoId);
          }
        }
      } else {
        alert("Error al actualizar favorito. Inténtalo de nuevo.");
      }
    }
  };

  const handleAddToList = async (listaId: number) => {
    if (!libro) return;
    try {
      await listaService.addLibroALista(listaId, libro);
      alert("Libro agregado a la lista exitosamente");
      setShowListaDropdown(false);
    } catch (error) {
      console.error("Error adding book to list:", error);
      alert("Error al agregar el libro a la lista");
    }
  };

  const handleAddToListByName = async (nombre: string) => {
    if (!libro || !isAuthenticated()) return;

    // Mapeo de nombres a tipos usando las constantes globales
    const tipoMap: { [key: string]: 'read' | 'to_read' | 'pending' | 'custom' } = {
      [LISTA_NOMBRES.TO_READ]: LISTA_TIPOS.TO_READ,
      [LISTA_NOMBRES.PENDING]: LISTA_TIPOS.PENDING,
      [LISTA_NOMBRES.READ]: LISTA_TIPOS.READ,
    };

    const tipo = tipoMap[nombre] || LISTA_TIPOS.CUSTOM;

    try {
      // Usar getOrCreateLista para obtener o crear la lista de forma segura
      const lista = await listaService.getOrCreateLista(nombre, tipo);
      
      // Actualizar el estado de listas si no existe localmente
      setListas(prev => {
        const exists = prev.some(l => l.id === lista.id);
        if (!exists) {
          return [...prev, lista];
        }
        return prev;
      });

      // Agregar el libro a la lista
      await listaService.addLibroALista(lista.id, libro);
      
      // Actualizar listasConLibro para marcar que este libro está en esta lista
      setListasConLibro(prevSet => {
        const newSet = new Set(prevSet);
        newSet.add(lista.id);
        return newSet;
      });
      
      alert(`Libro agregado a "${nombre}" exitosamente`);
      setShowListaDropdown(false);
    } catch (error: any) {
      console.error("Error adding book to list by name:", error);
      // Mostrar mensaje más específico si la lista ya existe
      if (error.message?.includes('ya existe') || error.response?.data?.message?.includes('ya existe')) {
        alert(`La lista "${nombre}" ya existe. El libro se agregó a la lista existente.`);
      } else {
        alert("Error al agregar el libro a la lista");
      }
    }
  };

  const refreshResenas = async () => {
    if (!libro) return;
    try {
      dispatch({ type: 'SET_REVIEWS_LOADING', payload: true });
      const reviewsData = await getResenasByLibro(libro.id);
      console.log("🔄 Refresh - Datos recibidos:", reviewsData);
      const reviews = reviewsData?.reviews || reviewsData || [];
      console.log("🔄 Refresh - Total reseñas:", reviews.length);
      const filtered = reviews.filter((r: Reseña) => r.estado !== "flagged");
      console.log("🔄 Refresh - Reseñas filtradas:", filtered.length);
      dispatch({ type: 'SET_REVIEWS', payload: filtered });
      // actualizar likedByUser y dislikedByUser tras refresh
      const token = getToken();
      const userId = token ? getUserIdFromToken(token) : 0;
      const likedMap: Record<number, boolean> = {};
      const dislikedMap: Record<number, boolean> = {};
      console.log(`🔍 RefreshResenas - userId: ${userId}`);
      filtered.forEach((r: Reseña) => {
        console.log(`📊 Reseña ${r.id} - reacciones:`, r.reacciones);
        // Verificar like en reseña principal
        if (r.reacciones?.some(rec => rec.tipo === "like" && (rec.usuarioId ?? 0) === userId)) {
          likedMap[r.id] = true;
          console.log(`✅ Usuario ${userId} dio LIKE a reseña ${r.id}`);
        }
        // Verificar dislike en reseña principal
        if (r.reacciones?.some(rec => rec.tipo === "dislike" && (rec.usuarioId ?? 0) === userId)) {
          dislikedMap[r.id] = true;
          console.log(`✅ Usuario ${userId} dio DISLIKE a reseña ${r.id}`);
        }
        // Verificar likes y dislikes en respuestas anidadas
        r.respuestas?.forEach(resp => {
          if (resp.reacciones?.some(rec => rec.tipo === "like" && (rec.usuarioId ?? 0) === userId)) {
            likedMap[resp.id] = true;
          }
          if (resp.reacciones?.some(rec => rec.tipo === "dislike" && (rec.usuarioId ?? 0) === userId)) {
            dislikedMap[resp.id] = true;
          }
        });
      });
      console.log(`🎯 Final likedMap:`, likedMap);
      console.log(`🎯 Final dislikedMap:`, dislikedMap);
      dispatch({ type: 'SET_LIKED_BY_USER', payload: likedMap });
      dispatch({ type: 'SET_DISLIKED_BY_USER', payload: dislikedMap });
      // Recalculate average rating from parent reviews only
      const calculatedAvg = filtered.length > 0
        ? filtered.reduce((sum: number, r: Reseña) => sum + r.estrellas, 0) / filtered.length
        : 0;
      dispatch({ type: 'SET_AVERAGE_RATING', payload: calculatedAvg });
    } catch (error) {
      console.warn("Error refreshing reviews:", error);
    } finally {
      dispatch({ type: 'SET_REVIEWS_LOADING', payload: false });
    }
  };

  const addResenaLocally = (r: Reseña) => {
    dispatch({ type: 'SET_REVIEWS', payload: [r, ...reviewState.reseñas] });
  };

  const startEditingReview = (review: Reseña, isReply: boolean = false) => {
    setEditingReviewId(review.id);
    setEditingIsReply(isReply);
    setEditingComentario(review.comentario || "");
    setEditingEstrellas(review.estrellas || 5);
    setOpenReviewMenuKey(null);
  };

  const cancelEditingReview = () => {
    setEditingReviewId(null);
    setEditingIsReply(false);
    setEditingComentario("");
    setEditingEstrellas(5);
  };

  const handleSaveReviewEdit = async (reviewId: number, isReply: boolean = editingIsReply) => {
    const comentarioLimpio = editingComentario.trim();
    if (!comentarioLimpio) {
      alert("La reseña no puede quedar vacía.");
      return;
    }

    setReviewActionLoading(true);
    try {
      const payload = isReply
        ? { comentario: comentarioLimpio }
        : { comentario: comentarioLimpio, estrellas: editingEstrellas };

      await editarResena(reviewId, payload);
      cancelEditingReview();
      await refreshResenas();
    } catch (error: any) {
      const backendErrors = Array.isArray(error?.errors) ? error.errors.join("\n") : null;
      alert(backendErrors || error?.message || "No se pudo editar la reseña.");
    } finally {
      setReviewActionLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    setOpenReviewMenuKey(null);
    if (!window.confirm("¿Seguro que querés eliminar esta reseña?")) {
      return;
    }

    setReviewActionLoading(true);
    try {
      await eliminarResena(reviewId);
      if (editingReviewId === reviewId) {
        cancelEditingReview();
      }
      await refreshResenas();
    } catch (error: any) {
      alert(error?.message || "No se pudo eliminar la reseña.");
    } finally {
      setReviewActionLoading(false);
    }
  };

  const renderStars = (rating: number, sizeClass = "w-4 h-4") =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${sizeClass} ${i < Math.round(rating) ? "text-amber-400 fill-current" : "text-gray-300"}`}
      />
    ));

  // StarsInput: componente para seleccionar rating con estrellas clicables
  const StarsInput: React.FC<{
    value: number;
    onChange: (v: number) => void;
    sizeClass?: string;
  }> = ({ value, onChange, sizeClass = "w-7 h-7" }) => {
    const [hover, setHover] = useState<number>(0);
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => {
          const idx = i + 1;
          const active = hover ? idx <= hover : idx <= value;
          return (
            <button
              key={idx}
              type="button"
              aria-label={`${idx} estrellas`}
              onMouseEnter={() => setHover(idx)}
              onMouseLeave={() => setHover(0)}
              onClick={() => onChange(idx)}
              className={`p-1 rounded ${active ? "text-amber-400" : "text-gray-300"} transition`}
            >
              <Star className={`${sizeClass} ${active ? "fill-current" : ""}`} />
            </button>
          );
        })}
      </div>
    );
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const sortedResenas = () => {
    const filtered = reviewState.reseñas;
    if (reviewState.sortOrder === "mas_recientes")
      return [...filtered].sort((a, b) => Number(new Date(b.fechaResena)) - Number(new Date(a.fechaResena)));
    return [...filtered].sort((a, b) => b.estrellas - a.estrellas);
  };

  // Calculate rating distribution
  const ratingDistribution = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewState.reseñas.forEach(review => {
      if (review.estrellas >= 1 && review.estrellas <= 5) {
        distribution[review.estrellas as keyof typeof distribution]++;
      }
    });
    return distribution;
  }, [reviewState.reseñas]);

  const toggleExpand = (id: number) =>
    dispatch({ type: 'TOGGLE_EXPAND_REVIEW', payload: id });

  const toggleReplyForm = (reviewId: number) => {
    dispatch({ type: 'SET_REPLY_FORM', payload: { reviewId, form: reviewState.replyForms[reviewId] ? null : { comentario: "", submitting: false, error: null } } });
  };

  const handleReplySubmit = async (reviewId: number, comentario: string) => {
    if (!libro) return;
    if (!isAuthenticated()) {
      alert("Debes iniciar sesión para responder a una reseña.");
      return;
    }
    if (!comentario.trim()) {
      dispatch({ type: 'SET_REPLY_FORM', payload: { reviewId, form: { ...reviewState.replyForms[reviewId]!, error: "El comentario no puede estar vacío." } } });
      return;
    }

    dispatch({ type: 'SET_REPLY_FORM', payload: { reviewId, form: { ...reviewState.replyForms[reviewId]!, submitting: true, error: null } } });

    try {
      const result = await crearRespuesta(reviewId, comentario);

      if (!result || !result.resena) {
        throw new Error("Respuesta inesperada del servidor al crear la respuesta");
      }

      // Refresh reviews to show the new reply
      await refreshResenas();

      // Close the form and reset
      dispatch({ type: 'SET_REPLY_FORM', payload: { reviewId, form: null } });
    } catch (err: any) {
      console.error("Error creando respuesta:", err);
      
      const validationErrors = Array.isArray(err?.errors) && err.errors.length > 0
        ? err.errors.join("\n")
        : null;

      // Detectar si es un error de moderación/rechazo
      const errorMsg = err.message || "No se pudo crear la respuesta";
      const isModerationError = errorMsg.toLowerCase().includes('moderación') || 
                                errorMsg.toLowerCase().includes('rechazada') ||
                                errorMsg.toLowerCase().includes('rechazado') ||
                                errorMsg.toLowerCase().includes('inapropiado') ||
                                errorMsg.toLowerCase().includes('normas') ||
                                errorMsg.toLowerCase().includes('calidad') ||
                                err.blocked === true;

      if (isModerationError) {
        // Mostrar modal de error de moderación
        setModerationError({
          message: validationErrors || errorMsg,
          details: {
            autoRejected: true,
            reasons: err.reasons || [],
            score: err.score
          }
        });
        setShowModerationModal(true);
        // Cerrar el formulario de respuesta pero sin error local
        dispatch({ type: 'SET_REPLY_FORM', payload: { reviewId, form: null } });
      } else {
        // Error normal, mostrarlo en el formulario
        dispatch({ type: 'SET_REPLY_FORM', payload: { reviewId, form: { ...reviewState.replyForms[reviewId]!, submitting: false, error: validationErrors || errorMsg } } });
      }
    }
  };

  // Helper: extraer userId desde un token JWT (si es que hay uno)
  const getUserIdFromToken = (token?: string): number => {
    if (!token) return 0;
    try {
      const parts = token.split(".");
      if (parts.length < 2) return 0;
      const payload = parts[1];
      // atob + manejo unicode
      const jsonString = decodeURIComponent(
        Array.prototype.map
          .call(atob(payload), (c: string) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const parsed = JSON.parse(jsonString);
      // buscar campos comunes
      return Number(parsed.id || parsed.sub || parsed.userId || parsed.usuarioId || 0) || 0;
    } catch (e) {
      return 0;
    }
  };

  // toggle like/unlike con manejo optimista y llamadas a servicios
  const handleToggleLike = async (reviewId: number) => {
    const token = getToken();
    if (!token) {
      alert("Debes iniciar sesión para dar like a una reseña.");
      return;
    }
    const usuarioId = getUserIdFromToken(token);
    const currentlyLiked = !!reviewState.likedByUser[reviewId];
    const currentlyDisliked = !!reviewState.dislikedByUser[reviewId];
    console.log(`🔄 Toggle like - reviewId: ${reviewId}, usuarioId: ${usuarioId}, currentlyLiked: ${currentlyLiked}, currentlyDisliked: ${currentlyDisliked}`);
    
    // snapshots para revertir en caso de error
    const prevResenas = reviewState.reseñas;
    const prevLiked = reviewState.likedByUser;
    const prevDisliked = reviewState.dislikedByUser;
    
    // Si está disliked, quitamos el dislike primero
    if (currentlyDisliked) {
      dispatch({ type: 'SET_DISLIKED_BY_USER', payload: { ...reviewState.dislikedByUser, [reviewId]: false } });
    }
    
    // optimista: actualizar contador y estado liked
    dispatch({ type: 'SET_LIKED_BY_USER', payload: { ...reviewState.likedByUser, [reviewId]: !currentlyLiked } });
    
    // Actualizar reacciones y contadores optimísticamente
    const updatedResenas = prevResenas.map(r => {
      if (r.id === reviewId) {
        // Primero quitar cualquier reacción existente del usuario (like o dislike)
        let newReacciones = r.reacciones?.filter(rec => !((rec.tipo === "like" || rec.tipo === "dislike") && (rec.usuarioId ?? 0) === usuarioId)) ?? [];
        
        // Si vamos a agregar like, lo agregamos
        if (!currentlyLiked) {
          newReacciones = [...newReacciones, { id: Date.now(), tipo: "like", usuarioId }];
        }
        
        // Actualizar reaccionesCount si existe
        const newReaccionesCount = r.reaccionesCount ? {
          ...r.reaccionesCount,
          likes: !currentlyLiked ? r.reaccionesCount.likes + 1 : Math.max(0, r.reaccionesCount.likes - 1),
          dislikes: currentlyDisliked ? Math.max(0, r.reaccionesCount.dislikes - 1) : r.reaccionesCount.dislikes,
          total: !currentlyLiked ? (currentlyDisliked ? r.reaccionesCount.total : r.reaccionesCount.total + 1) : Math.max(0, r.reaccionesCount.total - 1)
        } : undefined;
        
        return { ...r, reacciones: newReacciones, reaccionesCount: newReaccionesCount };
      }
      // También actualizar en respuestas anidadas
      if (r.respuestas) {
        return {
          ...r,
          respuestas: r.respuestas.map(resp => {
            if (resp.id === reviewId) {
              // Primero quitar cualquier reacción existente del usuario
              let newReacciones = resp.reacciones?.filter(rec => !((rec.tipo === "like" || rec.tipo === "dislike") && (rec.usuarioId ?? 0) === usuarioId)) ?? [];
              
              // Si vamos a agregar like, lo agregamos
              if (!currentlyLiked) {
                newReacciones = [...newReacciones, { id: Date.now(), tipo: "like", usuarioId }];
              }
              
              const newReaccionesCount = resp.reaccionesCount ? {
                ...resp.reaccionesCount,
                likes: !currentlyLiked ? resp.reaccionesCount.likes + 1 : Math.max(0, resp.reaccionesCount.likes - 1),
                dislikes: currentlyDisliked ? Math.max(0, resp.reaccionesCount.dislikes - 1) : resp.reaccionesCount.dislikes,
                total: !currentlyLiked ? (currentlyDisliked ? resp.reaccionesCount.total : resp.reaccionesCount.total + 1) : Math.max(0, resp.reaccionesCount.total - 1)
              } : undefined;
              
              return { ...resp, reacciones: newReacciones, reaccionesCount: newReaccionesCount };
            }
            return resp;
          })
        };
      }
      return r;
    });
    
    dispatch({ type: 'SET_REVIEWS', payload: updatedResenas });
    
    try {
      if (!currentlyLiked) {
        // Añadir like - solo enviar resenaId y tipo
        console.log("➕ Agregando like...");
        const result = await addOrUpdateReaccion({ resenaId: reviewId, tipo: "like" }, token);
        console.log("✅ Like agregado:", result);
      } else {
        // Quitar like
        console.log("➖ Quitando like...");
        const result = await deleteReaccion(usuarioId, reviewId, token);
        console.log("✅ Like quitado:", result);
      }
    } catch (err) {
      console.error("❌ Error guardando reaccion:", err);
      // revertir a los snapshots previos
      dispatch({ type: 'SET_LIKED_BY_USER', payload: prevLiked });
      dispatch({ type: 'SET_DISLIKED_BY_USER', payload: prevDisliked });
      dispatch({ type: 'SET_REVIEWS', payload: prevResenas });
      alert("No se pudo actualizar la reacción. Intentá de nuevo.");
    }
  };

  const handleToggleDislike = async (reviewId: number) => {
    const token = getToken();
    if (!token) {
      alert("Debes iniciar sesión para dar dislike a una reseña.");
      return;
    }
    const usuarioId = getUserIdFromToken(token);
    const currentlyLiked = !!reviewState.likedByUser[reviewId];
    const currentlyDisliked = !!reviewState.dislikedByUser[reviewId];
    console.log(`🔄 Toggle dislike - reviewId: ${reviewId}, usuarioId: ${usuarioId}, currentlyLiked: ${currentlyLiked}, currentlyDisliked: ${currentlyDisliked}`);
    
    // snapshots para revertir en caso de error
    const prevResenas = reviewState.reseñas;
    const prevLiked = reviewState.likedByUser;
    const prevDisliked = reviewState.dislikedByUser;
    
    // Si está liked, quitamos el like primero
    if (currentlyLiked) {
      dispatch({ type: 'SET_LIKED_BY_USER', payload: { ...reviewState.likedByUser, [reviewId]: false } });
    }
    
    // optimista: actualizar contador y estado disliked
    dispatch({ type: 'SET_DISLIKED_BY_USER', payload: { ...reviewState.dislikedByUser, [reviewId]: !currentlyDisliked } });
    
    // Actualizar reacciones y contadores optimísticamente
    const updatedResenas = prevResenas.map(r => {
      if (r.id === reviewId) {
        // Primero quitar cualquier reacción existente del usuario (like o dislike)
        let newReacciones = r.reacciones?.filter(rec => !((rec.tipo === "like" || rec.tipo === "dislike") && (rec.usuarioId ?? 0) === usuarioId)) ?? [];
        
        // Si vamos a agregar dislike, lo agregamos
        if (!currentlyDisliked) {
          newReacciones = [...newReacciones, { id: Date.now(), tipo: "dislike", usuarioId }];
        }
        
        // Actualizar reaccionesCount si existe
        const newReaccionesCount = r.reaccionesCount ? {
          ...r.reaccionesCount,
          likes: currentlyLiked ? Math.max(0, r.reaccionesCount.likes - 1) : r.reaccionesCount.likes,
          dislikes: !currentlyDisliked ? r.reaccionesCount.dislikes + 1 : Math.max(0, r.reaccionesCount.dislikes - 1),
          total: !currentlyDisliked ? (currentlyLiked ? r.reaccionesCount.total : r.reaccionesCount.total + 1) : Math.max(0, r.reaccionesCount.total - 1)
        } : undefined;
        
        return { ...r, reacciones: newReacciones, reaccionesCount: newReaccionesCount };
      }
      // También actualizar en respuestas anidadas
      if (r.respuestas) {
        return {
          ...r,
          respuestas: r.respuestas.map(resp => {
            if (resp.id === reviewId) {
              // Primero quitar cualquier reacción existente del usuario
              let newReacciones = resp.reacciones?.filter(rec => !((rec.tipo === "like" || rec.tipo === "dislike") && (rec.usuarioId ?? 0) === usuarioId)) ?? [];
              
              // Si vamos a agregar dislike, lo agregamos
              if (!currentlyDisliked) {
                newReacciones = [...newReacciones, { id: Date.now(), tipo: "dislike", usuarioId }];
              }
              
              const newReaccionesCount = resp.reaccionesCount ? {
                ...resp.reaccionesCount,
                likes: currentlyLiked ? Math.max(0, resp.reaccionesCount.likes - 1) : resp.reaccionesCount.likes,
                dislikes: !currentlyDisliked ? resp.reaccionesCount.dislikes + 1 : Math.max(0, resp.reaccionesCount.dislikes - 1),
                total: !currentlyDisliked ? (currentlyLiked ? resp.reaccionesCount.total : resp.reaccionesCount.total + 1) : Math.max(0, resp.reaccionesCount.total - 1)
              } : undefined;
              
              return { ...resp, reacciones: newReacciones, reaccionesCount: newReaccionesCount };
            }
            return resp;
          })
        };
      }
      return r;
    });
    
    dispatch({ type: 'SET_REVIEWS', payload: updatedResenas });
    
    try {
      if (!currentlyDisliked) {
        // Añadir dislike
        console.log("➕ Agregando dislike...");
        const result = await addOrUpdateReaccion({ resenaId: reviewId, tipo: "dislike" }, token);
        console.log("✅ Dislike agregado:", result);
      } else {
        // Quitar dislike
        console.log("➖ Quitando dislike...");
        const result = await deleteReaccion(usuarioId, reviewId, token);
        console.log("✅ Dislike quitado:", result);
      }
    } catch (err) {
      console.error("❌ Error guardando reaccion:", err);
      // revertir a los snapshots previos
      dispatch({ type: 'SET_LIKED_BY_USER', payload: prevLiked });
      dispatch({ type: 'SET_DISLIKED_BY_USER', payload: prevDisliked });
      dispatch({ type: 'SET_REVIEWS', payload: prevResenas });
      alert("No se pudo actualizar la reacción. Intentá de nuevo.");
    }
  };

  // Formulario inline para crear reseña (estrellas + textarea grande)
  const NewReviewForm: React.FC<{ libroId: string; onAdded?: () => void; onOptimisticAdd?: (r: Reseña) => void }> = ({ onAdded, onOptimisticAdd }) => {
    const [estrellas, setEstrellas] = useState<number>(5);
    const [comentario, setComentario] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);
    const [errorLocal, setErrorLocal] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!libro) return;
      if (!isAuthenticated()) {
        alert("Debes iniciar sesión para publicar una reseña.");
        return;
      }
      if (!comentario.trim()) {
        setErrorLocal("El comentario no puede estar vacío.");
        return;
      }

      setSubmitting(true);
      setErrorLocal(null);

      // Optimistic add: construir reseña temporal
      const tempReview: Reseña = {
        id: Date.now(),
        comentario,
        estrellas,
        estado: "PENDING", // optimista (coincide con backend)
        fechaResena: new Date().toISOString(),
        usuario: { id: 0, username: "Tú", nombre: undefined },
        reacciones: [],
      };

      try {
        // mostrar inmediatamente
        onOptimisticAdd?.(tempReview);

        // agregarReseña retorna body JSON { message, resena }
        const result = await agregarReseña(libro.id, comentario, estrellas, {
          id: libro.id,
          titulo: libro.titulo,
          autores: libro.autores,
          descripcion: libro.descripcion,
          imagen: libro.imagen,
          enlace: libro.enlace,
          source: libro.source,
        });

        if (!result || !result.resena) {
          throw new Error("Respuesta inesperada del servidor al crear la reseña");
        }

        // opcional: podrías insertar result.resena directamente en la lista en lugar de refrescar
        // pero para mantener consistencia con lo guardado en DB, hacemos refresh desde el servidor
        onAdded?.();
        setComentario("");
        setEstrellas(5);
      } catch (err: any) {
        console.error("Error creando reseña:", err);
        
        // Detectar si es un error de moderación
        const errorMsg = err.message || "No se pudo crear la reseña";
        const isModerationError = errorMsg.toLowerCase().includes('moderación') || 
                                  errorMsg.toLowerCase().includes('rechazada') ||
                                  errorMsg.toLowerCase().includes('normas') ||
                                  errorMsg.toLowerCase().includes('calidad');

        if (isModerationError) {
          // Extraer detalles si los hay en el error
          setModerationError({
            message: errorMsg,
            details: {
              autoRejected: true,
              reasons: err.reasons || [],
              score: err.score
            }
          });
          setShowModerationModal(true);
          setErrorLocal(null); // No mostrar error simple si mostramos el modal
        } else {
          setErrorLocal(errorMsg);
        }
        
        // quitar el temporal pidiendo al padre refrescar (onAdded)
        onAdded?.();
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tu calificación</label>
          <StarsInput value={estrellas} onChange={setEstrellas} sizeClass="w-7 h-7" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tu reseña</label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={6}
            className="w-full min-h-[8rem] resize-y rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 text-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            placeholder="Escribe tu reseña: qué te gustó, qué no, para quién recomendarías este libro..."
          />
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            <div>{comentario.length} caracteres</div>
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publicar reseña"}
              </button>
            </div>
          </div>
          {errorLocal && <div className="mt-2 text-sm text-red-600">{errorLocal}</div>}
        </div>
      </form>
    );
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-gray-950 dark:to-indigo-950">
        <DotLottieReact
          src="https://lottie.host/6d727e71-5a1d-461e-9434-c9e7eb1ae1d1/IWVmdeMHnT.lottie"
          loop
          autoplay
          style={{ width: 140, height: 140 }}
        />
      </div>
    );

  if (error || !libro)
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-950">
        <div className="text-center">
          <BookOpen className="w-12 h-12 mx-auto text-red-600 dark:text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{error || "Libro no encontrado"}</h2>
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
        </div>
      </div>
    );

  return (
    <>
      {/* Modal de Error de Moderación */}
      <ModerationErrorModal
        isOpen={showModerationModal}
        onClose={() => {
          setShowModerationModal(false);
          setModerationError(null);
        }}
        errorMessage={moderationError?.message || ''}
        moderationDetails={moderationError?.details}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950 transition-colors duration-300">
        {/* Header con efecto glassmorphism */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 transition-all duration-200 group font-medium"
              aria-label="Volver a la página anterior"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" /> 
              Volver
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">

          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-16">
            {/* Cover Section con animación */}
            <div className="w-full lg:w-auto flex justify-center lg:sticky lg:top-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <LibroImagen
                  src={libro.coverUrl || libro.imagen}
                  alt={`Portada del libro ${libro.titulo}`}
                  titulo={libro.titulo}
                  className="relative w-56 h-80 sm:w-64 sm:h-96 lg:w-72 lg:h-[432px] object-cover rounded-2xl shadow-2xl transition-all duration-500 group-hover:shadow-[0_20px_70px_-15px_rgba(6,182,212,0.3)] group-hover:scale-[1.02]"
                />
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-8 w-full max-w-3xl">
              <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 via-blue-600 to-indigo-700 dark:from-cyan-400 dark:via-blue-500 dark:to-indigo-500 leading-tight text-center lg:text-left">
                  {libro.titulo}
                </h1>

                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {libro.autores.map((a, i) => (
                    <AutorLink 
                      key={i} 
                      nombreCompleto={a} 
                      autorId={(libro as any).autorId || null}
                    />
                  ))}
                </div>

                {libro.source && (
                  <div className="flex justify-center lg:justify-start">
                    <span className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 px-4 py-2 rounded-full border border-gray-200 dark:border-slate-700">
                      Fuente: {libro.source === "hardcover" ? "Hardcover" : (libro.source === "bookcode" || libro.source === "local") ? "BookCode" : "Google Books"}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-6 justify-center lg:justify-start">
                <button
                  onClick={toggleFavorito}
                  className={`group relative p-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 ${
                    esFavorito
                      ? "bg-gradient-to-br from-red-500 to-pink-600 dark:from-red-600 dark:to-pink-700 text-white"
                      : "bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 border-2 border-gray-200 dark:border-slate-700"
                  }`}
                  aria-label={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                  <Heart className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110 ${esFavorito ? "fill-current" : ""}`} />
                </button>

                {isAuthenticated() && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowListaDropdown(!showListaDropdown)}
                      className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-500 dark:to-blue-600 text-white hover:scale-105 hover:from-cyan-700 hover:to-blue-700"
                      aria-label="Agregar a una lista"
                    >
                      <Plus className="w-5 h-5" />
                      Agregar a Lista
                    </button>

                  {showListaDropdown && (
                    <div className="absolute top-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl z-10 w-56 text-left overflow-hidden">
                      {/* Opciones predefinidas (siempre se muestran si estás logueado) */}
                      {nombresDeListasFijas.map((nombre) => {
                        const listaExistente = listas.find(l => l.nombre === nombre);
                        const estaEnLista = listaExistente ? listasConLibro.has(listaExistente.id) : false;
                        return (
                          <button
                            key={nombre}
                            onClick={() => {
                              if (listaExistente) {
                                handleToggleInList(listaExistente);
                              } else {
                                handleAddToListByName(nombre);
                              }
                            }}
                            className="block w-full text-left px-4 py-3 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 flex items-center justify-between text-gray-900 dark:text-slate-100 transition-colors font-medium"
                          >
                            <span>{nombre}</span>
                            {estaEnLista && <span className="text-green-500 dark:text-green-400 text-lg">✓</span>}
                          </button>
                        );
                      })}

                      {/* El separador y las listas personalizadas solo aparecen si existen y no duplican las fijas */}
                      {(() => {
                        const listasFiltradas = listas.filter(l => !nombresDeListasFijas.includes(l.nombre));
                        return listasFiltradas.length > 0 ? (
                          <>
                            <hr className="border-gray-200 dark:border-slate-700" />
                            {listasFiltradas.map((lista) => {
                              const estaEnLista = listasConLibro.has(lista.id);
                              return (
                                <button
                                  key={lista.id}
                                  onClick={() => estaEnLista ? null : handleAddToList(lista.id)}
                                  className={`block w-full text-left px-4 py-3 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 flex items-center justify-between transition-colors font-medium ${estaEnLista ? 'text-gray-400 dark:text-slate-600' : 'text-gray-900 dark:text-slate-100'}`}
                                  disabled={estaEnLista}
                                >
                                  <span>{lista.nombre}</span>
                                  {estaEnLista && <span className="text-green-500 dark:text-green-400 text-lg">✓</span>}
                                </button>
                              );
                            })}
                          </>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

        {/* Sinopsis */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 sm:p-10 border border-gray-100 dark:border-slate-700">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-slate-100">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700 rounded-xl">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              Sinopsis
            </h2>
            <p className={`text-lg text-gray-700 dark:text-slate-300 leading-relaxed ${!mostrarSinopsis ? "line-clamp-4" : ""}`}>
              {renderSinopsis(libro.descripcion)}
            </p>
            {libro.descripcion && plainTextLength(libro.descripcion) > 200 && (
              <button
                onClick={() => setMostrarSinopsis(!mostrarSinopsis)}
                className="mt-4 text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 flex items-center gap-2 font-semibold transition-colors"
              >
                {mostrarSinopsis ? (
                  <>
                    <ChevronUp className="w-5 h-5" /> Ver menos
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-5 h-5" /> Ver más
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 sm:p-10 border border-gray-100 dark:border-slate-700">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-900 dark:text-slate-100">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700 rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
              Calificación
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Promedio y contador de reseñas */}
              <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl border-2 border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-3">{renderStars(reviewState.averageRating || 0, "w-8 h-8")}</div>
                <span className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 mb-2">
                  {(reviewState.averageRating || 0).toFixed(1)}
                </span>
                <span className="text-sm text-gray-600 dark:text-slate-400 font-medium mb-4">de 5 estrellas</span>
                
                <div className="text-center pt-4 border-t border-amber-200 dark:border-amber-800 w-full">
                  <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {reviewState.reseñas.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">
                    {reviewState.reseñas.length === 1 ? 'reseña' : 'reseñas'}
                  </div>
                </div>
                
                {reviewState.reseñas.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-slate-400 text-center mt-4">¡Sé el primero en opinar!</p>
                )}
              </div>

              {/* Rating Distribution */}
              {reviewState.reseñas.length > 0 && (
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-slate-100">Distribución</h3>
                  <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratingDistribution[star as keyof typeof ratingDistribution];
                    const percentage = reviewState.reseñas.length > 0 ? (count / reviewState.reseñas.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 w-16 font-semibold text-gray-700 dark:text-slate-300">
                          <span>{star}</span>
                          <Star className="w-4 h-4 text-amber-400 fill-current" />
                        </div>
                        <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-slate-400 w-12 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              )}
            </div>
          </div>
        </div>

        {/* Reseñas mejoradas */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-3 text-gray-900 dark:text-slate-100">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 dark:from-pink-600 dark:to-rose-600 rounded-xl shadow-md">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              Reseñas
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-1.5 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-full border border-pink-200 dark:border-pink-800/50">
                <span className="text-sm font-semibold text-pink-700 dark:text-pink-300">{reviewState.reseñas.length} {reviewState.reseñas.length === 1 ? 'reseña' : 'reseñas'}</span>
              </div>

              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg px-3 py-2 border border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => dispatch({ type: 'SET_SORT_ORDER', payload: 'mas_recientes' })}
                  className={`text-xs sm:text-sm px-3 py-2 rounded-xl font-medium transition-all ${reviewState.sortOrder === 'mas_recientes' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                >
                  Recientes
                </button>
                <button
                  onClick={() => dispatch({ type: 'SET_SORT_ORDER', payload: 'mejor_valoradas' })}
                  className={`text-xs sm:text-sm px-3 py-2 rounded-xl font-medium transition-all ${reviewState.sortOrder === 'mejor_valoradas' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                >
                  Mejor valoradas
                </button>
                <button
                  onClick={() => dispatch({ type: 'SET_SORT_ORDER', payload: 'mas_populares' })}
                  className={`text-xs sm:text-sm px-3 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all ${reviewState.sortOrder === 'mas_populares' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  Populares
                </button>
              </div>
            </div>
          </div>

          {isAuthenticated() && (
            <>
              {/* Formulario de Reseña Completa */}
              <div className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-xl p-8 mb-10 border-2 border-blue-100 dark:border-blue-900">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-slate-100">Escribe tu reseña</h3>
                <NewReviewForm
                  libroId={libro.id}
                  onAdded={refreshResenas}
                  onOptimisticAdd={(r) => addResenaLocally(r)}
                />
              </div>
            </>
          )}

          <div className="space-y-6">
            {reviewState.reviewsLoading ? (
              <div className="flex items-center justify-center p-12 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-xl">
                <Loader2 className="w-8 h-8 animate-spin mr-3 text-blue-600 dark:text-blue-400" /> 
                <span className="text-lg font-medium text-gray-900 dark:text-slate-100">Cargando reseñas...</span>
              </div>
            ) : sortedResenas().length === 0 ? (
              <div className="bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-xl p-12 text-center border-2 border-purple-100 dark:border-purple-900">
                <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full inline-block mb-6">
                  <MessageCircle className="w-16 h-16 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-lg text-gray-600 dark:text-slate-300">Aún no hay reseñas para este libro.</p>
                <p className="text-gray-500 dark:text-slate-400 mt-2">¡Sé el primero en compartir tu opinión!</p>
              </div>
            ) : (
              sortedResenas().map((r) => {
                const currentUserId = getCurrentUserId();
                const isOwnReview = currentUserId === r.usuario.id;
                
                return (
                <article key={r.id} className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all border border-gray-100 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-800">
                <div className="flex gap-4">
                  <UserAvatar usuario={r.usuario} clickable={!isOwnReview} currentUserId={currentUserId} />

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          {isOwnReview ? (
                            <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{r.usuario.nombre || r.usuario.username}</h4>
                          ) : (
                            <Link 
                              to={`/perfil/${r.usuario.id}`} 
                              className="font-semibold text-lg text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            >
                              {r.usuario.nombre || r.usuario.username}
                            </Link>
                          )}
                          {r.estado === "PENDING" && (
                            <span className="inline-block bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs px-2 py-1 rounded-full font-medium">
                              Pendiente de moderación
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1">
                            {renderStars(r.estrellas, "w-4 h-4")} <span className="ml-2">{r.estrellas}/5</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2 relative" ref={openReviewMenuKey === `review-${r.id}` ? reviewMenuRef : undefined}>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(r.fechaResena)}</span>
                        <button
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="Más opciones"
                          onClick={() => setOpenReviewMenuKey(prev => prev === `review-${r.id}` ? null : `review-${r.id}`)}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openReviewMenuKey === `review-${r.id}` && (
                          <div className="absolute right-0 top-7 z-10 w-40 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl p-1">
                            <button
                              type="button"
                              className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                              onClick={() => startEditingReview(r)}
                            >
                              Editar reseña
                            </button>
                            <button
                              type="button"
                              className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => handleDeleteReview(r.id)}
                            >
                              Eliminar reseña
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 text-gray-700 dark:text-gray-300">
                      {editingReviewId === r.id && !editingIsReply ? (
                        <div className="space-y-3 rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-900/20 p-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Calificación</label>
                            <select
                              value={editingEstrellas}
                              onChange={(e) => setEditingEstrellas(Number(e.target.value))}
                              className="rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-gray-900 dark:text-slate-100"
                            >
                              {[1, 2, 3, 4, 5].map((n) => (
                                <option key={n} value={n}>{n} estrella{n > 1 ? 's' : ''}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Comentario</label>
                            <textarea
                              value={editingComentario}
                              onChange={(e) => setEditingComentario(e.target.value)}
                              rows={4}
                              className="w-full resize-y rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-gray-900 dark:text-slate-100"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600"
                              onClick={cancelEditingReview}
                              disabled={reviewActionLoading}
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                              onClick={() => handleSaveReviewEdit(r.id)}
                              disabled={reviewActionLoading}
                            >
                              {reviewActionLoading ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                      {/* bloque de comentario más grande: text-lg y mayor line-height */}
                      <p className={`${reviewState.expandedReviewIds[r.id] ? '' : 'line-clamp-5'} text-lg leading-relaxed`}>{r.comentario}</p>
                      {r.comentario && r.comentario.length > 300 && (
                        <button onClick={() => toggleExpand(r.id)} className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                          {reviewState.expandedReviewIds[r.id] ? <><ChevronUp className="w-4 h-4"/> Ver menos</> : <><ChevronDown className="w-4 h-4"/> Ver más</>}
                        </button>
                      )}
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5 text-sm items-center">
                      <button
                        onClick={() => handleToggleLike(r.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all transform ${
                          reviewState.likedByUser[r.id] 
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105" 
                            : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-600 hover:text-blue-600 dark:hover:text-blue-400"
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${reviewState.likedByUser[r.id] ? "fill-current" : ""}`} />
                        <span className="font-bold">{r.reaccionesCount?.likes || 0}</span>
                      </button>

                      <button
                        onClick={() => handleToggleDislike(r.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all transform ${
                          reviewState.dislikedByUser[r.id] 
                            ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105" 
                            : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-slate-600 hover:text-red-600 dark:hover:text-red-400"
                        }`}
                      >
                        <ThumbsDown className={`w-4 h-4 ${reviewState.dislikedByUser[r.id] ? "fill-current" : ""}`} />
                        <span className="font-bold">{r.reaccionesCount?.dislikes || 0}</span>
                      </button>

                      <button
                        onClick={() => toggleReplyForm(r.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all font-medium"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Responder
                      </button>

                      {(r.respuestas && r.respuestas.length > 1) && (
                        <button
                          onClick={() => dispatch({ type: 'TOGGLE_EXPAND_REPLIES', payload: r.id.toString() })}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-all font-medium"
                        >
                          {reviewState.expandedReplies[r.id.toString()] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          {reviewState.expandedReplies[r.id.toString()] 
                            ? "Ver menos" 
                            : `Ver ${(r.respuestas ? r.respuestas.length - 1 : 0)} ${(r.respuestas && r.respuestas.length - 1 === 1) ? 'respuesta' : 'respuestas'}`
                          }
                        </button>
                      )}

                      <span className="ml-auto text-xs text-gray-400 dark:text-slate-500 px-3 py-1.5 bg-gray-50 dark:bg-slate-700/50 rounded-full">ID: {r.id}</span>
                    </div>

                    {reviewState.replyForms[r.id] && (
                      <div className="mt-5 p-5 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 rounded-2xl border-2 border-cyan-200 dark:border-cyan-800 shadow-inner">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tu respuesta</label>
                            <textarea
                              value={reviewState.replyForms[r.id]!.comentario}
                              onChange={(e) =>
                                dispatch({ type: 'SET_REPLY_FORM', payload: { reviewId: r.id, form: { ...reviewState.replyForms[r.id]!, comentario: e.target.value } } })
                              }
                              rows={3}
                              className="w-full resize-y rounded-xl border-2 border-cyan-300 dark:border-cyan-700 p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100"
                              placeholder="Escribe tu respuesta..."
                            />
                          </div>

                          <div className="flex gap-3 justify-end">
                            <button
                              type="button"
                              onClick={() => dispatch({ type: 'SET_REPLY_FORM', payload: { reviewId: r.id, form: null } })}
                              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleReplySubmit(
                                  r.id,
                                  reviewState.replyForms[r.id]!.comentario
                                )
                              }
                              disabled={reviewState.replyForms[r.id]!.submitting || !reviewState.replyForms[r.id]!.comentario.trim()}
                              className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all hover:scale-105"
                            >
                              {reviewState.replyForms[r.id]!.submitting ? "Enviando..." : "Responder"}
                            </button>
                          </div>

                          {reviewState.replyForms[r.id]!.error && (
                            <p className="text-sm text-red-600 dark:text-red-400 whitespace-pre-line">{reviewState.replyForms[r.id]!.error}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Display replies */}
                    {r.respuestas && r.respuestas.length > 0 && (() => {
                      const isOwnFirstReply = currentUserId === r.respuestas[0].usuario.id;
                      
                      return (
                      <div className="mt-6 space-y-4 border-l-4 border-pink-200 dark:border-pink-800/50 pl-6 ml-4">
                        {/* Always show the first reply */}
                        <div className="bg-gradient-to-br from-pink-50/50 to-rose-50/50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-2xl p-5 border border-pink-100 dark:border-pink-800/50 shadow-sm">
                          <div className="flex gap-3">
                            <UserAvatar usuario={r.respuestas[0].usuario} size="w-10 h-10" clickable={!isOwnFirstReply} currentUserId={currentUserId} />

                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2">
                                    {isOwnFirstReply ? (
                                      <h5 className="font-semibold text-base text-gray-900 dark:text-gray-100">{r.respuestas[0].usuario.nombre || r.respuestas[0].usuario.username}</h5>
                                    ) : (
                                      <Link 
                                        to={`/perfil/${r.respuestas[0].usuario.id}`}
                                        className="font-semibold text-base text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                      >
                                        {r.respuestas[0].usuario.nombre || r.respuestas[0].usuario.username}
                                      </Link>
                                    )}
                                    {r.respuestas[0].resenaPadre && (
                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                        respondiendo a{' '}
                                        {!r.respuestas[0].resenaPadre.usuario.id || currentUserId === r.respuestas[0].resenaPadre.usuario.id ? (
                                          <span>{r.respuestas[0].resenaPadre.usuario.nombre || r.respuestas[0].resenaPadre.usuario.username}</span>
                                        ) : (
                                          <Link 
                                            to={`/perfil/${r.respuestas[0].resenaPadre.usuario.id}`}
                                            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                          >
                                            {r.respuestas[0].resenaPadre.usuario.nombre || r.respuestas[0].resenaPadre.usuario.username}
                                          </Link>
                                        )}
                                      </span>
                                    )}
                                  </div>

                                </div>

                                <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2 relative" ref={openReviewMenuKey === `reply-${r.respuestas[0].id}` ? reviewMenuRef : undefined}>
                                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(r.respuestas[0].fechaResena)}</span>
                                  <button
                                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                    title="Más opciones"
                                    onClick={() => setOpenReviewMenuKey(prev => prev === `reply-${r.respuestas![0].id}` ? null : `reply-${r.respuestas![0].id}`)}
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </button>
                                  {openReviewMenuKey === `reply-${r.respuestas[0].id}` && (
                                    <div className="absolute right-0 top-7 z-10 w-40 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl p-1">
                                      <button
                                        type="button"
                                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                                        onClick={() => startEditingReview(r.respuestas![0], true)}
                                      >
                                        Editar respuesta
                                      </button>
                                      <button
                                        type="button"
                                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        onClick={() => handleDeleteReview(r.respuestas![0].id)}
                                      >
                                        Eliminar respuesta
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="mt-2 text-gray-700 dark:text-gray-300">
                                {editingReviewId === r.respuestas[0].id && editingIsReply ? (
                                  <div className="space-y-3 rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-900/20 p-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Respuesta</label>
                                      <textarea
                                        value={editingComentario}
                                        onChange={(e) => setEditingComentario(e.target.value)}
                                        rows={3}
                                        className="w-full resize-y rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-gray-900 dark:text-slate-100"
                                      />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <button
                                        type="button"
                                        className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600"
                                        onClick={cancelEditingReview}
                                        disabled={reviewActionLoading}
                                      >
                                        Cancelar
                                      </button>
                                      <button
                                        type="button"
                                        className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                                        onClick={() => handleSaveReviewEdit(r.respuestas![0].id, true)}
                                        disabled={reviewActionLoading}
                                      >
                                        {reviewActionLoading ? 'Guardando...' : 'Guardar cambios'}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-base leading-relaxed">{r.respuestas[0].comentario}</p>
                                )}
                              </div>

                              <div className="flex gap-3 mt-4 text-sm items-center">
                                <button
                                  onClick={() => r.respuestas && r.respuestas[0] && handleToggleLike(r.respuestas[0].id)}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all transform ${
                                    r.respuestas && r.respuestas[0] && reviewState.likedByUser[r.respuestas[0].id]
                                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                                      : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-600 hover:text-blue-600 dark:hover:text-blue-400"
                                  }`}
                                  disabled={!r.respuestas || !r.respuestas[0]}
                                >
                                  <ThumbsUp className={`w-3.5 h-3.5 ${r.respuestas && r.respuestas[0] && reviewState.likedByUser[r.respuestas[0].id] ? "fill-current" : ""}`} />
                                  <span className="text-xs font-bold">{r.respuestas && r.respuestas[0] ? (r.respuestas[0].reaccionesCount?.likes || 0) : 0}</span>
                                </button>

                                <button
                                  onClick={() => r.respuestas && r.respuestas[0] && handleToggleDislike(r.respuestas[0].id)}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all transform ${
                                    r.respuestas && r.respuestas[0] && reviewState.dislikedByUser[r.respuestas[0].id]
                                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                                      : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-slate-600 hover:text-red-600 dark:hover:text-red-400"
                                  }`}
                                  disabled={!r.respuestas || !r.respuestas[0]}
                                >
                                  <ThumbsDown className={`w-3.5 h-3.5 ${r.respuestas && r.respuestas[0] && reviewState.dislikedByUser[r.respuestas[0].id] ? "fill-current" : ""}`} />
                                  <span className="text-xs font-bold">{r.respuestas && r.respuestas[0] ? (r.respuestas[0].reaccionesCount?.dislikes || 0) : 0}</span>
                                </button>

                                <span className="ml-auto text-xs text-gray-400 dark:text-slate-500 px-2 py-1 bg-gray-50 dark:bg-slate-700/50 rounded-full">ID: {r.respuestas[0].id}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Show additional replies only if expanded */}
                        {reviewState.expandedReplies[r.id.toString()] && r.respuestas.slice(1).map((reply) => {
                          const isOwnReply = currentUserId === reply.usuario.id;
                          
                          return (
                          <div key={reply.id} className="bg-gradient-to-br from-pink-50/50 to-rose-50/50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-2xl p-5 border border-pink-100 dark:border-pink-800/50 shadow-sm">
                            <div className="flex gap-4">
                              <UserAvatar usuario={reply.usuario} size="w-10 h-10" clickable={!isOwnReply} currentUserId={currentUserId} />

                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      {isOwnReply ? (
                                        <h5 className="font-semibold text-base text-gray-900 dark:text-gray-100">{reply.usuario.nombre || reply.usuario.username}</h5>
                                      ) : (
                                        <Link 
                                          to={`/perfil/${reply.usuario.id}`}
                                          className="font-semibold text-base text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                        >
                                          {reply.usuario.nombre || reply.usuario.username}
                                        </Link>
                                      )}
                                      {reply.resenaPadre && (
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                          respondiendo a{' '}
                                          {!reply.resenaPadre.usuario.id || currentUserId === reply.resenaPadre.usuario.id ? (
                                            <span>{reply.resenaPadre.usuario.nombre || reply.resenaPadre.usuario.username}</span>
                                          ) : (
                                            <Link 
                                              to={`/perfil/${reply.resenaPadre.usuario.id}`}
                                              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                            >
                                              {reply.resenaPadre.usuario.nombre || reply.resenaPadre.usuario.username}
                                            </Link>
                                          )}
                                        </span>
                                      )}
                                    </div>

                                  </div>

                                  <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2 relative" ref={openReviewMenuKey === `reply-${reply.id}` ? reviewMenuRef : undefined}>
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(reply.fechaResena)}</span>
                                    <button
                                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                      title="Más opciones"
                                      onClick={() => setOpenReviewMenuKey(prev => prev === `reply-${reply.id}` ? null : `reply-${reply.id}`)}
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                    {openReviewMenuKey === `reply-${reply.id}` && (
                                      <div className="absolute right-0 top-7 z-10 w-40 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl p-1">
                                        <button
                                          type="button"
                                          className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                                          onClick={() => startEditingReview(reply, true)}
                                        >
                                          Editar respuesta
                                        </button>
                                        <button
                                          type="button"
                                          className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                          onClick={() => handleDeleteReview(reply.id)}
                                        >
                                          Eliminar respuesta
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="mt-2 text-gray-700 dark:text-gray-300">
                                  {editingReviewId === reply.id && editingIsReply ? (
                                    <div className="space-y-3 rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-900/20 p-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Respuesta</label>
                                        <textarea
                                          value={editingComentario}
                                          onChange={(e) => setEditingComentario(e.target.value)}
                                          rows={3}
                                          className="w-full resize-y rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-gray-900 dark:text-slate-100"
                                        />
                                      </div>
                                      <div className="flex justify-end gap-2">
                                        <button
                                          type="button"
                                          className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600"
                                          onClick={cancelEditingReview}
                                          disabled={reviewActionLoading}
                                        >
                                          Cancelar
                                        </button>
                                        <button
                                          type="button"
                                          className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                                          onClick={() => handleSaveReviewEdit(reply.id, true)}
                                          disabled={reviewActionLoading}
                                        >
                                          {reviewActionLoading ? 'Guardando...' : 'Guardar cambios'}
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-base leading-relaxed">{reply.comentario}</p>
                                  )}
                                </div>

                                <div className="flex gap-3 mt-4 text-sm items-center">
                                  <button
                                    onClick={() => handleToggleLike(reply.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all transform ${
                                      reviewState.likedByUser[reply.id]
                                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                                        : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-600 hover:text-blue-600 dark:hover:text-blue-400"
                                    }`}
                                  >
                                    <ThumbsUp className={`w-3.5 h-3.5 ${reviewState.likedByUser[reply.id] ? "fill-current" : ""}`} />
                                    <span className="text-xs font-bold">{reply.reaccionesCount?.likes || 0}</span>
                                  </button>

                                  <button
                                    onClick={() => handleToggleDislike(reply.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all transform ${
                                      reviewState.dislikedByUser[reply.id]
                                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                                        : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-slate-600 hover:text-red-600 dark:hover:text-red-400"
                                    }`}
                                  >
                                    <ThumbsDown className={`w-3.5 h-3.5 ${reviewState.dislikedByUser[reply.id] ? "fill-current" : ""}`} />
                                    <span className="text-xs font-bold">{reply.reaccionesCount?.dislikes || 0}</span>
                                  </button>

                                  <span className="ml-auto text-xs text-gray-400 dark:text-slate-500 px-2 py-1 bg-gray-50 dark:bg-slate-700/50 rounded-full">ID: {reply.id}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                      );
                    })()}
                  </div>
                </div>
              </article>
                );
              })
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export { DetalleLibro };
