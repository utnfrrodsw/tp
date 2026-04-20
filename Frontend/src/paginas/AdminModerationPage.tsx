import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  obtenerResenasPendientes,
  aprobarResena,
  rechazarResena,
} from "../services/resenaService";
import { getAccessToken } from "../utils/tokenUtil";
import {
  Search,
  Star,
  RefreshCw,
  LogIn,
  Mail,
  Home,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  Filter,
  TrendingUp,
  Clock,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------------------
   Types
   --------------------------- */
interface Resena {
  id: number;
  comentario: string;
  estrellas: number;
  fechaResena: string;
  estado?: 'pending' | 'approved' | 'flagged';
  moderationScore?: number | null;
  moderationReasons?: string; // JSON string
  autoModerated?: boolean;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    username?: string;
    avatar?: string;
  };
  libro: {
    id: number;
    titulo: string;
    slug?: string;
  };
}

/* ---------------------------
   Constantes
   --------------------------- */
const PAGE_SIZE = 10;
const formatDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString() : "");

/* ---------------------------
   Componente Avatar de Usuario
   --------------------------- */
const UserAvatar: React.FC<{ 
  usuario: { nombre: string; username?: string; avatar?: string }; 
  size?: string 
}> = ({ usuario, size = "w-12 h-12" }) => {
  const [imageError, setImageError] = useState(false);

  const getAvatarSrc = () => {
    if (!usuario.avatar) return null;
    if (usuario.avatar.startsWith('http://') || usuario.avatar.startsWith('https://')) {
      return usuario.avatar;
    }
    if (usuario.avatar.includes('.')) {
      return `/assets/${usuario.avatar}`;
    }
    return `/assets/${usuario.avatar}.svg`;
  };

  const avatarSrc = getAvatarSrc();
  
  // Si hay avatar y no hubo error al cargar
  if (avatarSrc && !imageError) {
    return (
      <motion.img
        whileHover={{ scale: 1.1 }}
        src={avatarSrc}
        alt={`Avatar de ${usuario.username || usuario.nombre}`}
        className={`${size} rounded-full object-cover shadow-md border-2 border-white`}
        onError={() => {
          setImageError(true);
        }}
      />
    );
  }
  
  // Fallback: mostrar iniciales
  const initials = (usuario.nombre || usuario.username || "?")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`${size} rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center font-semibold shadow-md border-2 border-white`}
      title={`Avatar de ${usuario.nombre}`}
    >
      {initials}
    </motion.div>
  );
};

/* ---------------------------
   Componente Score de Moderación
   --------------------------- */
const ModerationBadge: React.FC<{ score?: number | null; autoModerated?: boolean }> = ({ score, autoModerated }) => {
  const hasScore = typeof score === "number" && Number.isFinite(score);
  const normalizedScore = hasScore ? Math.max(0, Math.min(100, Math.round(score))) : null;

  let bgColor = "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600";
  let textColor = "text-gray-700 dark:text-gray-300";
  let icon = <Info className="w-4 h-4" />;
  let label = "Sin análisis";
  let borderColor = "border-gray-300 dark:border-gray-600";

  if (normalizedScore !== null && normalizedScore >= 80) {
    bgColor = "bg-gradient-to-r from-emerald-50 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30";
    textColor = "text-emerald-700 dark:text-emerald-400";
    icon = <CheckCircle className="w-4 h-4" />;
    label = "Bajo riesgo";
    borderColor = "border-emerald-200 dark:border-emerald-800";
  } else if (normalizedScore !== null && normalizedScore >= 40) {
    bgColor = "bg-gradient-to-r from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30";
    textColor = "text-amber-700 dark:text-amber-400";
    icon = <AlertTriangle className="w-4 h-4" />;
    label = "Revisar";
    borderColor = "border-amber-200 dark:border-amber-800";
  } else if (normalizedScore !== null) {
    bgColor = "bg-gradient-to-r from-red-50 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30";
    textColor = "text-red-700 dark:text-red-400";
    icon = <Shield className="w-4 h-4" />;
    label = "Alto riesgo";
    borderColor = "border-red-200 dark:border-red-800";
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${bgColor} ${textColor} border ${borderColor} text-xs font-semibold shadow-sm`}
    >
      {icon}
      <span>{normalizedScore === null ? label : `${label}: ${normalizedScore}/100`}</span>
      {autoModerated && (
        <span className="ml-1 px-2 py-0.5 bg-white/50 rounded-full text-[10px]">Auto</span>
      )}
    </motion.div>
  );
};

/* ---------------------------
   Componente Razones de Moderación
   --------------------------- */
const ModerationReasons: React.FC<{ reasons?: string }> = ({ reasons }) => {
  if (!reasons) return null;

  let parsed: any;
  try {
    parsed = JSON.parse(reasons);
  } catch {
    return null;
  }

  const items: string[] = [];
  if (parsed.sentiment) items.push(`Sentimiento: ${parsed.sentiment}`);
  if (parsed.profanity) items.push(`Lenguaje: ${parsed.profanity}`);
  if (parsed.spam) items.push(`Spam: ${parsed.spam}`);
  if (parsed.toxicity !== undefined) items.push(`Toxicidad: ${parsed.toxicity}%`);

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-blue-900 mb-2 text-sm">Análisis automático:</div>
          <ul className="space-y-1.5">
            {items.map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-xs text-blue-800 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

/* ---------------------------
   Notificación flotante
   --------------------------- */
const Notice: React.FC<{ type: "success" | "error"; text: string; onClose?: () => void }> = ({
  type,
  text,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      role="alert"
      aria-live="polite"
      className={`fixed right-6 bottom-6 z-50 max-w-sm shadow-2xl rounded-2xl px-5 py-4 backdrop-blur-lg ${
        type === "success" 
          ? "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border-2 border-emerald-300 dark:border-emerald-700" 
          : "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border-2 border-red-300 dark:border-red-700"
      }`}
    >
      <div className="flex items-start gap-3">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="pt-0.5"
        >
          {type === "success" ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white shadow-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center text-white shadow-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
        </motion.div>
        <div className="text-sm font-medium text-gray-800 dark:text-gray-100 flex-1 pt-1">{text}</div>
        <button 
          aria-label="Cerrar notificación" 
          onClick={onClose} 
          className="text-gray-400 hover:text-gray-700 dark:text-gray-300 transition-colors p-1 hover:bg-white/50 rounded-lg"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

/* ---------------------------
   Componente principal
   --------------------------- */
const AdminModerationPage: React.FC = () => {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null); // null = checking

  // UI state
  const [query, setQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [moderationFilter, setModerationFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [sortBy, setSortBy] = useState<"fecha_desc" | "fecha_asc" | "estrellas_desc" | "estrellas_asc">(
    "fecha_desc"
  );
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [actionLoadingIds, setActionLoadingIds] = useState<Record<number, boolean>>({});
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [confirmReject, setConfirmReject] = useState<{ ids: number[]; comentario?: string } | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const getRequestErrorMessage = (err: unknown, fallback: string) => {
    const status = (err as any)?.status;
    const message = (err as Error)?.message ?? "";

    if (status === 401 || message.includes("Sesión expirada")) {
      return "Sesión expirada. Volvé a iniciar sesión.";
    }

    if (status === 403) {
      return "No tenés permisos para moderar reseñas.";
    }

    return fallback;
  };

  const resetFilters = () => {
    setQuery("");
    setRatingFilter("all");
    setModerationFilter("all");
    setSortBy("fecha_desc");
    setPage(1);
  };

  const cargarResenasPendientes = useCallback(async () => {
    setLoading(true);
    setGlobalError(null);
    setHasPermission(null);
    try {
      const token = getAccessToken();
      if (!token) {
        setHasPermission(false);
        setResenas([]);
        return;
      }
      const data = await obtenerResenasPendientes(token);
      setResenas(Array.isArray(data) ? data : []);
      setHasPermission(true);
    } catch (err: any) {
      // intenta detectar 401/403 en varios formatos
      const status = err?.response?.status ?? err?.status ?? (typeof err === "number" ? err : undefined);
      if (status === 401 || status === 403) {
        setHasPermission(false);
        setResenas([]);
      } else {
        console.error(err);
        setGlobalError("Ocurrió un problema al cargar las reseñas pendientes. Intentá recargar.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargarResenasPendientes();
  }, [cargarResenasPendientes]);

  /* ---------- utilidades UI ---------- */
  const toggleSelect = (id: number) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectAllOnPage = (itemsOnPage: Resena[]) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allSelected = itemsOnPage.length > 0 && itemsOnPage.every((it) => next.has(it.id));
      if (allSelected) itemsOnPage.forEach((it) => next.delete(it.id));
      else itemsOnPage.forEach((it) => next.add(it.id));
      return next;
    });

  const clearSelection = () => setSelectedIds(new Set());
  const toggleExpand = (id: number) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  /* ---------- filtrado, orden y paginado ---------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = resenas.filter((r) => {
      const score = typeof r.moderationScore === "number" && Number.isFinite(r.moderationScore)
        ? r.moderationScore
        : null;
      const comentario = (r.comentario ?? "").toLowerCase();
      const usuarioNombre = (r.usuario?.nombre ?? "").toLowerCase();
      const usuarioEmail = (r.usuario?.email ?? "").toLowerCase();
      const libroTitulo = ((r.libro as any)?.titulo ?? (r.libro as any)?.nombre ?? "").toLowerCase();

      // Filtro por rating
      if (ratingFilter !== "all" && r.estrellas !== ratingFilter) return false;
      
      // Filtro por score de moderación
      if (moderationFilter !== "all") {
        if (score === null) return false;
        if (moderationFilter === "high" && score < 80) return false;
        if (moderationFilter === "medium" && (score < 40 || score >= 80)) return false;
        if (moderationFilter === "low" && score >= 40) return false;
      }
      
      // Filtro por texto
      if (!q) return true;
      return (
        comentario.includes(q) ||
        usuarioNombre.includes(q) ||
        usuarioEmail.includes(q) ||
        libroTitulo.includes(q)
      );
    });

    switch (sortBy) {
      case "fecha_asc":
        arr = arr.sort((a, b) => new Date(a.fechaResena).getTime() - new Date(b.fechaResena).getTime());
        break;
      case "fecha_desc":
        arr = arr.sort((a, b) => new Date(b.fechaResena).getTime() - new Date(a.fechaResena).getTime());
        break;
      case "estrellas_asc":
        arr = arr.sort((a, b) => a.estrellas - b.estrellas);
        break;
      case "estrellas_desc":
        arr = arr.sort((a, b) => b.estrellas - a.estrellas);
        break;
    }

    return arr;
  }, [resenas, query, ratingFilter, moderationFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const highCount = resenas.filter((r) => typeof r.moderationScore === "number" && r.moderationScore >= 80).length;
  const mediumCount = resenas.filter((r) => {
    if (typeof r.moderationScore !== "number") return false;
    const score = r.moderationScore;
    return score >= 40 && score < 80;
  }).length;
  const lowCount = resenas.filter((r) => typeof r.moderationScore === "number" && r.moderationScore < 40).length;
  const unscoredCount = resenas.filter((r) => typeof r.moderationScore !== "number" || !Number.isFinite(r.moderationScore)).length;

  const setLoadingFor = (id: number, loading: boolean) =>
    setActionLoadingIds((prev) => ({ ...prev, [id]: loading }));

  const selectAllFiltered = () =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allSelected = filtered.length > 0 && filtered.every((item) => next.has(item.id));
      if (allSelected) filtered.forEach((item) => next.delete(item.id));
      else filtered.forEach((item) => next.add(item.id));
      return next;
    });

  /* ---------- acciones (optimistic UI) ---------- */
  const handleAprobar = async (id: number) => {
    const token = getAccessToken();
    if (!token) return setNotice({ type: "error", text: "No autorizado." });
    setLoadingFor(id, true);
    const original = resenas;
    try {
      setResenas((prev) => prev.filter((r) => r.id !== id));
      await aprobarResena(id, token);
      setNotice({ type: "success", text: "Reseña aprobada." });
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      console.error(err);
      setResenas(original);
      setNotice({ type: "error", text: getRequestErrorMessage(err, "Error al aprobar la reseña.") });
    } finally {
      setLoadingFor(id, false);
    }
  };

  const requestReject = (ids: number[]) => setConfirmReject({ ids, comentario: "" });

  const performReject = async (ids: number[], comentario?: string) => {
    const token = getAccessToken();
    if (!token) return setNotice({ type: "error", text: "No autorizado." });
    const original = resenas;
    ids.forEach((id) => setLoadingFor(id, true));
    try {
      setResenas((prev) => prev.filter((r) => !ids.includes(r.id)));
      for (const id of ids) {
        await rechazarResena(id, token, comentario);
      }
      setNotice({ type: "success", text: `Se rechazaron ${ids.length} reseña(s).` });
      setSelectedIds((prev) => {
        const next = new Set(prev);
        ids.forEach((i) => next.delete(i));
        return next;
      });
    } catch (err) {
      console.error(err);
      setResenas(original);
      setNotice({ type: "error", text: getRequestErrorMessage(err, "Error al rechazar reseñas.") });
    } finally {
      ids.forEach((id) => setLoadingFor(id, false));
      setConfirmReject(null);
    }
  };

  const handleAprobarMasivo = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return setNotice({ type: "error", text: "No seleccionaste reseñas." });
    const token = getAccessToken();
    if (!token) return setNotice({ type: "error", text: "No autorizado." });
    const original = resenas;
    ids.forEach((id) => setLoadingFor(id, true));
    try {
      setResenas((prev) => prev.filter((r) => !ids.includes(r.id)));
      for (const id of ids) {
        await aprobarResena(id, token);
      }
      setNotice({ type: "success", text: `Aprobadas ${ids.length} reseña(s).` });
      clearSelection();
    } catch (err) {
      console.error(err);
      setResenas(original);
      setNotice({ type: "error", text: getRequestErrorMessage(err, "Error al aprobar reseñas.") });
    } finally {
      ids.forEach((id) => setLoadingFor(id, false));
    }
  };

  /* ---------- utilidades de navegación ---------- */
  const goToLogin = () => (window.location.href = "/LoginPage");
  const goHome = () => (window.location.href = "/");
  const contactSupport = () =>
    (window.location.href = "mailto:soporte@tuapp.com?subject=Acceso%20Moderaci%C3%B3n%20Rese%C3%B1as");

  /* ---------- helpers UI ---------- */

  /* ---------- RENDER ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header mejorado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-lg sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg"
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-[2.1rem] leading-tight font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Moderación de Reseñas
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Revisá reseñas pendientes y elegí si se publican o se ocultan.</p>
              </div>
            </div>

            {hasPermission !== false && (
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-xl"
                >
                  <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                    {resenas.length} Pendientes
                  </span>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cargarResenasPendientes}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all hover:border-indigo-300 dark:hover:border-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  aria-label="Actualizar reseñas"
                >
                  <RefreshCw className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="hidden sm:inline font-medium text-indigo-900 dark:text-indigo-200">Actualizar</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28">

        {/* ---------- SIN PERMISO ---------- */}
        {hasPermission === false && (
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid place-items-center py-12"
          >
            <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-32 h-32 rounded-2xl bg-gradient-to-br from-red-100 via-rose-100 to-orange-100 dark:from-red-900/40 dark:via-rose-900/40 dark:to-orange-900/40 flex items-center justify-center shadow-lg"
                >
                  <Shield className="w-16 h-16 text-red-500 dark:text-red-400" />
                </motion.div>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent mb-3">
                    Acceso denegado
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    No tenés permisos para moderar reseñas desde esta cuenta. Si creés que es un error, podés iniciar sesión con otra cuenta o solicitar acceso al equipo de administración.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={goToLogin}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg font-medium"
                    >
                      <LogIn className="w-5 h-5" /> Iniciar sesión
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={contactSupport}
                      className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                    >
                      <Mail className="w-5 h-5" /> Solicitar acceso
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={goHome}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                    >
                      <Home className="w-5 h-5" /> Volver al inicio
                    </motion.button>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-xs text-blue-800">
                      💡 <strong>Consejo:</strong> Si te conectaste con una cuenta personal y deberías tener permisos, pedile al administrador que te asigne el rol de moderador.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ---------- ERROR GLOBAL ---------- */}
        {hasPermission !== false && globalError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-2xl mb-6 shadow-lg flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold mb-1">Error al cargar</div>
              <div className="text-sm">{globalError}</div>
            </div>
          </motion.div>
        )}

        {/* ---------- SKELETON LOADING ---------- */}
        {hasPermission !== false && loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="animate-pulse bg-white/70 dark:bg-gray-800/70 backdrop-blur rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-48" />
                      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-16" />
                    </div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-full" />
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-5/6" />
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-4/6" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ---------- UI PRINCIPAL ---------- */}
        {hasPermission !== false && !loading && !globalError && (
          <>
            {/* controles mejorados */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Buscar y filtrar</h3>
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                {/* Búsqueda */}
                <div className="relative flex-1">
                  <div className="absolute left-4 top-3.5 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-800 focus:border-indigo-400 transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    placeholder="Buscar por comentario, usuario o libro..."
                    aria-label="Buscar reseñas"
                  />
                </div>

                {/* Filtros */}
                <div className="flex flex-wrap gap-3">
                  <select
                    value={ratingFilter}
                    onChange={(e) => {
                      const v = e.target.value;
                      setRatingFilter(v === "all" ? "all" : Number(v));
                      setPage(1);
                    }}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-800 focus:border-indigo-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer"
                    aria-label="Filtrar por valoración"
                  >
                    <option value="all">Todas las valoraciones</option>
                    <option value="5">5 estrellas</option>
                    <option value="4">4 estrellas</option>
                    <option value="3">3 estrellas</option>
                    <option value="2">2 estrellas</option>
                    <option value="1">1 estrella</option>
                  </select>

                  <select
                    value={moderationFilter}
                    onChange={(e) => {
                      setModerationFilter(e.target.value as any);
                      setPage(1);
                    }}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-800 focus:border-indigo-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer"
                    aria-label="Filtrar por calidad de moderación"
                  >
                    <option value="all">Todos los niveles</option>
                    <option value="high">Bajo riesgo (80+)</option>
                    <option value="medium">Revisar (40-79)</option>
                    <option value="low">Alto riesgo (&lt;40)</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-800 focus:border-indigo-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer"
                    aria-label="Ordenar reseñas"
                  >
                    <option value="fecha_desc">Más recientes</option>
                    <option value="fecha_asc">Más antiguas</option>
                    <option value="estrellas_desc">Mayor valoración</option>
                    <option value="estrellas_asc">Menor valoración</option>
                  </select>

                  <button
                    onClick={resetFilters}
                    className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    aria-label="Limpiar filtros"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
                <p className="text-xs text-gray-500 dark:text-gray-400">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{resenas.length}</p>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-900/20 p-4 shadow-sm">
                <p className="text-xs text-emerald-700 dark:text-emerald-300">Bajo riesgo</p>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{highCount}</p>
              </div>
              <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-900/20 p-4 shadow-sm">
                <p className="text-xs text-amber-700 dark:text-amber-300">Revisar</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{mediumCount}</p>
              </div>
              <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50/70 dark:bg-red-900/20 p-4 shadow-sm">
                <p className="text-xs text-red-700 dark:text-red-300">Alto riesgo</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">{lowCount}</p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/20 p-4 shadow-sm">
                <p className="text-xs text-slate-700 dark:text-slate-300">Sin análisis</p>
                <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">{unscoredCount}</p>
              </div>
            </div>

            {/* acciones en lote mejoradas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 bg-white/90 dark:bg-gray-800/90 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-3 items-center">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="h-10 inline-flex items-center gap-2 px-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl border border-indigo-200 dark:border-indigo-700">
                    <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Reseñas marcadas: <span className="text-indigo-600 dark:text-indigo-400">{selectedIds.size}</span> / {filtered.length}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => selectAllOnPage(paginated)}
                    className="h-10 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    Marcar toda la página
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={selectAllFiltered}
                    className="h-10 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    Marcar todas las filtradas
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearSelection}
                    className="h-10 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-red-300 dark:hover:border-red-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    Quitar selección
                  </motion.button>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400 xl:text-right">
                  Usá la barra flotante para publicar u ocultar varias reseñas.
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {selectedIds.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-40 rounded-2xl border-2 border-indigo-400 dark:border-indigo-500 bg-white dark:bg-gray-800 backdrop-blur shadow-[0_18px_44px_-16px_rgba(79,70,229,0.55)] p-3 w-[calc(100%-2rem)] max-w-xl"
                >
                  <div className="mb-2 px-1 text-[11px] font-semibold tracking-wide uppercase text-indigo-700 dark:text-indigo-300">
                    Acciones sobre marcadas
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-10 px-3 inline-flex items-center rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-100 text-sm font-semibold whitespace-nowrap border border-indigo-200 dark:border-indigo-700">
                      {selectedIds.size} marcada(s)
                    </div>
                    <button
                      onClick={handleAprobarMasivo}
                      className="h-10 px-4 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition whitespace-nowrap shadow-sm"
                    >
                      Aprobar y publicar
                    </button>
                    <button
                      onClick={() => requestReject(Array.from(selectedIds))}
                      className="h-10 px-4 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition whitespace-nowrap shadow-sm"
                    >
                      Rechazar y ocultar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* lista mejorada */}
            {paginated.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800/80 backdrop-blur rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-600"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">¡Todo al día!</h3>
                <p className="text-gray-500 dark:text-gray-400">No hay reseñas pendientes de moderación en este momento.</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {paginated.map((resena, index) => {
                    const isLoading = !!actionLoadingIds[resena.id];
                    const isSelected = selectedIds.has(resena.id);
                    const isExpanded = expandedIds.has(resena.id);
                    return (
                      <motion.article
                        key={resena.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border transition-all ${
                          isSelected ? "border-indigo-400 dark:border-indigo-600 shadow-xl ring-1 ring-indigo-300/70 dark:ring-indigo-700/70" : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
                        } p-6 flex flex-col md:flex-row gap-5 hover:shadow-2xl`}
                      >
                        <div className="flex-shrink-0">
                          <UserAvatar 
                            usuario={{
                              nombre: resena.usuario.nombre,
                              username: resena.usuario.username,
                              avatar: resena.usuario.avatar
                            }} 
                            size="w-16 h-16" 
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <header className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">{resena.usuario.nombre}</h3>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <span className="font-semibold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />Libro:</span>{" "}
                                <span className="font-medium">{(resena.libro as any).nombre || resena.libro.titulo}</span>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                                <Mail className="w-3 h-3" />
                                {resena.usuario.email}
                              </div>
                              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(resena.fechaResena)}
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 rounded-xl border border-amber-300 dark:border-amber-700 shadow-sm">
                                <Star className="w-4 h-4 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
                                <span className="text-sm font-bold text-amber-700 dark:text-amber-300">{resena.estrellas}/5</span>
                              </div>

                              <label className="inline-flex items-center gap-2 cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelect(resena.id)}
                                  className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-2 focus:ring-indigo-300 cursor-pointer"
                                  aria-label={`Seleccionar reseña ${resena.id}`}
                                />
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 transition-colors">
                                  Marcar
                                </span>
                              </label>
                            </div>
                          </header>

                          {/* Badge de moderación */}
                          <div className="mb-3">
                            <ModerationBadge score={resena.moderationScore} autoModerated={resena.autoModerated} />
                          </div>

                          <div className="mt-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              {isExpanded ? resena.comentario : resena.comentario.slice(0, 300)}
                              {resena.comentario.length > 300 && (
                                <>
                                  {!isExpanded ? "..." : ""}
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => toggleExpand(resena.id)}
                                    className="ml-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline"
                                  >
                                    {isExpanded ? "Mostrar menos ↑" : "Mostrar más ↓"}
                                  </motion.button>
                                </>
                              )}
                            </p>
                          </div>

                          {/* Razones de moderación */}
                          <ModerationReasons reasons={resena.moderationReasons} />

                          <div className="mt-4 flex flex-wrap gap-3 items-center">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAprobar(resena.id)}
                              disabled={isLoading}
                              className={`h-10 px-5 rounded-xl text-white text-sm font-semibold shadow-md transition-all ${
                                isLoading
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300`}
                            >
                              {isLoading ? "Procesando..." : "Aprobar y publicar"}
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => requestReject([resena.id])}
                              disabled={isLoading}
                              className={`h-10 px-5 rounded-xl text-white text-sm font-semibold shadow-md transition-all ${
                                isLoading
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300`}
                            >
                              Rechazar y ocultar
                            </motion.button>

                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              href={`/libros/${resena.libro.slug ?? resena.libro.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="h-10 px-5 rounded-xl border-2 border-indigo-300 dark:border-indigo-700 text-sm font-semibold hover:bg-indigo-50 dark:hover:bg-gray-700 inline-flex items-center gap-2 transition-all text-indigo-700 dark:text-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                            >
                              Ver libro original
                            </motion.a>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* paginación mejorada */}
            {filtered.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-5"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <span>
                      Mostrando{" "}
                      <span className="font-bold text-indigo-600">{(currentPage - 1) * PAGE_SIZE + 1}</span>
                      {" - "}
                      <span className="font-bold text-indigo-600">
                        {Math.min(currentPage * PAGE_SIZE, filtered.length)}
                      </span>
                      {" de "}
                      <span className="font-bold text-indigo-600">{filtered.length}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: currentPage !== 1 ? 1.05 : 1 }}
                      whileTap={{ scale: currentPage !== 1 ? 0.95 : 1 }}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800 border-2 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </motion.button>

                    <div className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-lg">
                      Página {currentPage} / {totalPages}
                    </div>

                    <motion.button
                      whileHover={{ scale: currentPage !== totalPages ? 1.05 : 1 }}
                      whileTap={{ scale: currentPage !== totalPages ? 0.95 : 1 }}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all ${
                        currentPage === totalPages
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800 border-2 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      Siguiente
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* modal confirmar rechazo mejorado */}
      <AnimatePresence>
        {confirmReject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setConfirmReject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-rose-600 px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Confirmar rechazo y ocultamiento</h3>
                    <p className="text-red-100 text-sm mt-1">
                      Esta acción no se puede deshacer
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-6">
                <div className="mb-5 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-xl">
                  <p className="text-sm text-red-900 dark:text-red-100">
                    Vas a rechazar y ocultar{" "}
                    <span className="font-bold text-red-600 dark:text-red-300">{confirmReject.ids.length}</span>{" "}
                    reseña{confirmReject.ids.length > 1 ? "s" : ""}. Podés agregar un comentario opcional que se registre con el rechazo.
                  </p>
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Motivo interno del moderador (opcional)
                  </label>
                  <textarea
                    value={confirmReject.comentario}
                    onChange={(e) => setConfirmReject({ ...confirmReject, comentario: e.target.value })}
                    placeholder="Ej: Contiene lenguaje inapropiado o incumple normas de la comunidad..."
                    className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl p-4 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all min-h-[120px] text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-gray-700 px-8 py-5 flex gap-3 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setConfirmReject(null)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => performReject(confirmReject.ids, confirmReject.comentario)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 shadow-lg transition-all"
                >
                  Rechazar y ocultar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* notificación */}
      <AnimatePresence>
        {notice && <Notice type={notice.type} text={notice.text} onClose={() => setNotice(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default AdminModerationPage;
