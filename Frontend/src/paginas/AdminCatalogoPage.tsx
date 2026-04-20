import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Search, Filter, Edit3, Save, X, RefreshCw, Power, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { adminCatalogService, AdminAutor, AdminLibro } from '../services/adminCatalogService';
import { isAdmin } from '../utils/jwtUtils';
import { getAccessToken } from '../utils/tokenUtil';
import { getCategorias } from '../services/categoriaService';

type EstadoFiltro = 'todos' | 'activo' | 'inactivo';
type Tab = 'libros' | 'autores';

interface CategoriaOption {
  id: number;
  nombre: string;
}

type NoticeType = 'success' | 'error';
const DEFAULT_ESTADO: EstadoFiltro = 'todos';

interface NoticeState {
  type: NoticeType;
  text: string;
}

interface ConfirmToggleState {
  entity: 'libro' | 'autor';
  id: number;
  activoActual: boolean;
  nombre: string;
}

interface AuthorWithBooksError {
  autorId: number;
  autorNombre: string;
  booksCount: number;
  books: Array<{ id: number; nombre: string; activo: boolean }>;
}

interface EditLibroModalState {
  libroId: number;
  nombre: string;
  sinopsis: string;
  imagen: string;
  enlace: string;
  autorId: number | null;
  autorNombre: string;
  autorApellido: string;
  autorFoto: string;
  autorBiografia: string;
}

const badgeClass = (activo: boolean) =>
  activo
    ? 'inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 text-xs font-semibold'
    : 'inline-flex items-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2.5 py-1 text-xs font-semibold';

const fieldClass =
  'w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 focus:border-indigo-400 dark:focus:border-indigo-500';

const ghostButtonClass =
  'inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition';

const AdminCatalogoPage: React.FC = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>('libros');
  const [estado, setEstado] = useState<EstadoFiltro>(DEFAULT_ESTADO);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [libros, setLibros] = useState<AdminLibro[]>([]);
  const [autores, setAutores] = useState<AdminAutor[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editLibroModal, setEditLibroModal] = useState<EditLibroModalState | null>(null);
  const [editingAutorId, setEditingAutorId] = useState<number | null>(null);
  const [editAutorForm, setEditAutorForm] = useState({ nombre: '', apellido: '', foto: '', biografia: '' });

  const [busyId, setBusyId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<ConfirmToggleState | null>(null);
  const [authorWithBooksError, setAuthorWithBooksError] = useState<AuthorWithBooksError | null>(null);

  const [categorias, setCategorias] = useState<CategoriaOption[]>([]);
  const [autorOptions, setAutorOptions] = useState<AdminAutor[]>([]);

  const [newAutor, setNewAutor] = useState({
    nombre: '',
    apellido: '',
    biografia: '',
    foto: '',
  });

  const [newLibro, setNewLibro] = useState({
    nombre: '',
    categoriaId: '',
    autorId: '',
    nombreAutor: '',
    apellidoAutor: '',
    sinopsis: '',
    imagen: '',
    enlace: '',
  });

  const emptyMessage = useMemo(() => {
    if (tab === 'libros') return 'No hay libros administrables con ese filtro.';
    return 'No hay autores administrables con ese filtro.';
  }, [tab]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const notifySuccess = (text: string) => {
    setError(null);
    setNotice({ type: 'success', text });
  };

  const notifyError = (text: string) => {
    setError(text);
    setNotice({ type: 'error', text });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (tab === 'libros') {
        const response = await adminCatalogService.getLibros({
          search,
          estado,
          page,
          limit: 10,
        });
        setLibros(response.data);
        setTotalPages(response.totalPages || 1);
      } else {
        const response = await adminCatalogService.getAutores({
          search,
          estado,
          page,
          limit: 10,
        });
        setAutores(response.data);
        setTotalPages(response.totalPages || 1);
      }
    } catch (err: any) {
      notifyError(err.message || 'No se pudo cargar el catalogo administrable');
    } finally {
      setLoading(false);
    }
  };

  const loadCreateOptions = async () => {
    try {
      const [categoriasData, autoresData] = await Promise.all([
        getCategorias(),
        adminCatalogService.getAutores({ estado: 'activo', page: 1, limit: 100 }),
      ]);

      const categoriasList = Array.isArray(categoriasData) ? categoriasData : [];
      setCategorias(
        categoriasList
          .filter((c: any) => typeof c?.id === 'number')
          .map((c: any) => ({ id: c.id, nombre: c.nombre || `Categoría ${c.id}` }))
      );
      setAutorOptions(autoresData.data || []);
    } catch {
      setCategorias([]);
      setAutorOptions([]);
    }
  };

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate('/LoginPage');
      return;
    }
    if (!isAdmin()) {
      navigate('/');
      return;
    }

    void loadData();
    void loadCreateOptions();
  }, [navigate, tab, estado, page, search]);

  useEffect(() => {
    if (!newLibro.autorId) return;
    const selected = autorOptions.find((a) => String(a.id) === newLibro.autorId);
    if (!selected) return;

    setNewLibro((prev) => ({
      ...prev,
      nombreAutor: selected.nombre,
      apellidoAutor: selected.apellido,
    }));
  }, [newLibro.autorId, autorOptions]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const onResetFilters = () => {
    setSearchInput('');
    setSearch('');
    setEstado(DEFAULT_ESTADO);
    setPage(1);
  };

  const startEditLibro = (libro: AdminLibro) => {
    setEditLibroModal({
      libroId: libro.id,
      nombre: libro.nombre || '',
      sinopsis: libro.sinopsis || '',
      imagen: libro.imagen || '',
      enlace: libro.enlace || '',
      autorId: libro.autor?.id ?? null,
      autorNombre: libro.autor?.nombre || '',
      autorApellido: libro.autor?.apellido || '',
      autorFoto: libro.autor?.foto || '',
      autorBiografia: libro.autor?.biografia || '',
    });
  };

  const startEditAutor = (autor: AdminAutor) => {
    setEditingAutorId(autor.id);
    setEditAutorForm({
      nombre: autor.nombre || '',
      apellido: autor.apellido || '',
      foto: autor.foto || '',
      biografia: autor.biografia || '',
    });
  };

  const saveLibro = async () => {
    if (!editLibroModal) return;

    if (!editLibroModal.nombre.trim()) {
      notifyError('El nombre del libro es obligatorio');
      return;
    }

    if (editLibroModal.autorId && (!editLibroModal.autorNombre.trim() || !editLibroModal.autorApellido.trim())) {
      notifyError('Nombre y apellido del autor son obligatorios');
      return;
    }

    try {
      setBusyId(editLibroModal.libroId);
      await adminCatalogService.updateLibro(editLibroModal.libroId, {
        nombre: editLibroModal.nombre.trim(),
        sinopsis: editLibroModal.sinopsis.trim(),
        imagen: editLibroModal.imagen.trim(),
        enlace: editLibroModal.enlace.trim(),
      });

      if (editLibroModal.autorId) {
        await adminCatalogService.updateAutor(editLibroModal.autorId, {
          nombre: editLibroModal.autorNombre.trim(),
          apellido: editLibroModal.autorApellido.trim(),
          foto: editLibroModal.autorFoto.trim() || undefined,
          biografia: editLibroModal.autorBiografia.trim() || undefined,
        });
      }

      setEditLibroModal(null);
      await loadData();
      notifySuccess('Libro actualizado correctamente');
    } catch (err: any) {
      notifyError(err.message || 'No se pudo actualizar el libro');
    } finally {
      setBusyId(null);
    }
  };

  const saveAutor = async (id: number) => {
    try {
      setBusyId(id);
      await adminCatalogService.updateAutor(id, editAutorForm);
      setEditingAutorId(null);
      await loadData();
    } catch (err: any) {
      notifyError(err.message || 'No se pudo actualizar el autor');
    } finally {
      setBusyId(null);
    }
  };

  const toggleLibro = async (id: number, activoActual: boolean) => {
    try {
      setBusyId(id);
      await adminCatalogService.updateLibroEstado(id, !activoActual);
      await loadData();
      notifySuccess(!activoActual ? 'Libro reactivado correctamente' : 'Libro dado de baja correctamente');
    } catch (err: any) {
      notifyError(err.message || 'No se pudo cambiar el estado del libro');
    } finally {
      setBusyId(null);
    }
  };

  const toggleAutor = async (id: number, activoActual: boolean) => {
    try {
      setBusyId(id);
      await adminCatalogService.updateAutorEstado(id, !activoActual);
      await loadData();
      notifySuccess(!activoActual ? 'Autor reactivado correctamente' : 'Autor dado de baja correctamente');
    } catch (err: any) {
      // Verificar si el error es por autor con libros asociados
      if (err.errorCode === 'AUTHOR_HAS_BOOKS') {
        const autor = autores.find(a => a.id === id);
        setAuthorWithBooksError({
          autorId: id,
          autorNombre: autor ? `${autor.nombre} ${autor.apellido}` : 'Desconocido',
          booksCount: err.booksCount || 0,
          books: err.books || [],
        });
      } else {
        notifyError(err.message || 'No se pudo cambiar el estado del autor');
      }
    } finally {
      setBusyId(null);
    }
  };

  const openConfirmToggle = (payload: ConfirmToggleState) => {
    setConfirmToggle(payload);
  };

  const onConfirmToggle = async () => {
    if (!confirmToggle) return;

    if (confirmToggle.entity === 'libro') {
      await toggleLibro(confirmToggle.id, confirmToggle.activoActual);
    } else {
      await toggleAutor(confirmToggle.id, confirmToggle.activoActual);
    }

    setConfirmToggle(null);
  };

  const createAutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAutor.nombre.trim() || !newAutor.apellido.trim()) {
      notifyError('Nombre y apellido del autor son obligatorios');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      await adminCatalogService.createAutor({
        nombre: newAutor.nombre.trim(),
        apellido: newAutor.apellido.trim(),
        biografia: newAutor.biografia.trim() || undefined,
        foto: newAutor.foto.trim() || undefined,
      });
      setNewAutor({ nombre: '', apellido: '', biografia: '', foto: '' });
      await loadCreateOptions();
      if (tab === 'autores') {
        setPage(1);
        await loadData();
      }
      notifySuccess('Autor creado correctamente');
    } catch (err: any) {
      notifyError(err.message || 'No se pudo crear el autor');
    } finally {
      setCreating(false);
    }
  };

  const createLibro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLibro.nombre.trim()) {
      notifyError('El nombre del libro es obligatorio');
      return;
    }
    if (!newLibro.categoriaId) {
      notifyError('La categoría del libro es obligatoria');
      return;
    }
    if (!newLibro.nombreAutor.trim() || !newLibro.apellidoAutor.trim()) {
      notifyError('El nombre y apellido del autor son obligatorios');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      await adminCatalogService.createLibro({
        nombre: newLibro.nombre.trim(),
        categoriaId: Number(newLibro.categoriaId),
        nombreAutor: newLibro.nombreAutor.trim(),
        apellidoAutor: newLibro.apellidoAutor.trim(),
        sinopsis: newLibro.sinopsis.trim() || undefined,
        imagen: newLibro.imagen.trim() || undefined,
        enlace: newLibro.enlace.trim() || undefined,
      });
      setNewLibro({
        nombre: '',
        categoriaId: '',
        autorId: '',
        nombreAutor: '',
        apellidoAutor: '',
        sinopsis: '',
        imagen: '',
        enlace: '',
      });
      if (tab === 'libros') {
        setPage(1);
        await loadData();
      }
      notifySuccess('Libro creado correctamente');
    } catch (err: any) {
      notifyError(err.message || 'No se pudo crear el libro');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-700 dark:to-blue-800 rounded-2xl p-6 text-white shadow-xl mb-6 border border-indigo-400/30 dark:border-indigo-500/30">
          <h1 className="text-2xl sm:text-3xl font-bold">Administrar Catalogo</h1>
          <p className="text-indigo-100 mt-2">Gestion de libros y autores creados por administracion, con baja y reactivacion.</p>
        </div>

        <div className="bg-white dark:bg-gray-900/80 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-6 backdrop-blur-sm">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === 'libros' ? 'bg-white dark:bg-gray-900 text-blue-700 dark:text-blue-300 shadow' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={() => {
                  setTab('libros');
                  setPage(1);
                  setEditingAutorId(null);
                }}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                Libros
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === 'autores' ? 'bg-white dark:bg-gray-900 text-blue-700 dark:text-blue-300 shadow' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={() => {
                  setTab('autores');
                  setPage(1);
                  setEditLibroModal(null);
                }}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Autores
              </button>
            </div>

            <button
              onClick={() => void loadData()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <RefreshCw className="w-4 h-4" />
              Recargar
            </button>
          </div>

          <form onSubmit={onSearchSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">Buscar</label>
              <div className="mt-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={tab === 'libros' ? 'Titulo o autor...' : 'Nombre o apellido...'}
                  className={`${fieldClass} pl-9`}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">Estado</label>
              <div className="mt-1 relative">
                <Filter className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <select
                  value={estado}
                  onChange={(e) => {
                    setEstado(e.target.value as EstadoFiltro);
                    setPage(1);
                  }}
                  className={`${fieldClass} pl-9`}
                >
                  <option value="todos">Todos</option>
                  <option value="activo">Activos</option>
                  <option value="inactivo">Inactivos</option>
                </select>
              </div>
            </div>

            <div className="flex items-end gap-2">
              <button type="submit" className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition text-sm font-semibold">
                Aplicar
              </button>
              <button type="button" onClick={onResetFilters} className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm font-semibold border border-gray-300 dark:border-gray-600">
                Limpiar
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-900/80 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
          {loading ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-300">Cargando...</div>
          ) : tab === 'libros' ? (
            libros.length === 0 ? (
              <div className="p-8 text-center text-gray-600 dark:text-gray-300">{emptyMessage}</div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {libros.map((libro) => (
                  <div key={libro.id} className="p-4 sm:p-5 hover:bg-gray-50/70 dark:hover:bg-gray-800/60 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{libro.nombre || 'Sin titulo'}</h3>
                          <span className={badgeClass(libro.activo)}>{libro.activo ? 'Activo' : 'Inactivo'}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          Autor: {libro.autor ? `${libro.autor.nombre} ${libro.autor.apellido}` : 'Sin autor'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => startEditLibro(libro)} className={ghostButtonClass}>
                          <Edit3 className="w-4 h-4" /> Editar
                        </button>
                        <button
                          disabled={busyId === libro.id}
                          onClick={() =>
                            openConfirmToggle({
                              entity: 'libro',
                              id: libro.id,
                              activoActual: libro.activo,
                              nombre: libro.nombre || 'Libro sin título',
                            })
                          }
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${libro.activo ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'} disabled:opacity-60`}
                        >
                          <Power className="w-4 h-4" /> {libro.activo ? 'Dar de baja' : 'Reactivar'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : autores.length === 0 ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-300">{emptyMessage}</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {autores.map((autor) => (
                <div key={autor.id} className="p-4 sm:p-5 hover:bg-gray-50/70 dark:hover:bg-gray-800/60 transition-colors">
                  {editingAutorId === autor.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        value={editAutorForm.nombre}
                        onChange={(e) => setEditAutorForm((prev) => ({ ...prev, nombre: e.target.value }))}
                        placeholder="Nombre"
                        className={fieldClass}
                      />
                      <input
                        value={editAutorForm.apellido}
                        onChange={(e) => setEditAutorForm((prev) => ({ ...prev, apellido: e.target.value }))}
                        placeholder="Apellido"
                        className={fieldClass}
                      />
                      <input
                        value={editAutorForm.foto}
                        onChange={(e) => setEditAutorForm((prev) => ({ ...prev, foto: e.target.value }))}
                        placeholder="URL foto"
                        className={fieldClass}
                      />
                      <textarea
                        value={editAutorForm.biografia}
                        onChange={(e) => setEditAutorForm((prev) => ({ ...prev, biografia: e.target.value }))}
                        placeholder="Biografia"
                        className={`${fieldClass} min-h-[90px]`}
                      />
                      <div className="md:col-span-2 flex gap-2 justify-end">
                        <button onClick={() => setEditingAutorId(null)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm font-semibold">
                          <X className="w-4 h-4" /> Cancelar
                        </button>
                        <button
                          disabled={busyId === autor.id}
                          onClick={() => void saveAutor(autor.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-60"
                        >
                          <Save className="w-4 h-4" /> Guardar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{autor.nombre} {autor.apellido}</h3>
                          <span className={badgeClass(autor.activo)}>{autor.activo ? 'Activo' : 'Inactivo'}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{autor.biografia || 'Sin biografia cargada.'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => startEditAutor(autor)} className={ghostButtonClass}>
                          <Edit3 className="w-4 h-4" /> Editar
                        </button>
                        <button
                          disabled={busyId === autor.id}
                          onClick={() =>
                            openConfirmToggle({
                              entity: 'autor',
                              id: autor.id,
                              activoActual: autor.activo,
                              nombre: `${autor.nombre} ${autor.apellido}`,
                            })
                          }
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${autor.activo ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'} disabled:opacity-60`}
                        >
                          <Power className="w-4 h-4" /> {autor.activo ? 'Dar de baja' : 'Reactivar'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Pagina {page} de {Math.max(1, totalPages)}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm font-semibold disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm font-semibold disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <form onSubmit={createAutor} className="bg-white dark:bg-gray-900/80 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-5 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Crear Autor
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={newAutor.nombre}
                onChange={(e) => setNewAutor((prev) => ({ ...prev, nombre: e.target.value }))}
                placeholder="Nombre"
                className={fieldClass}
              />
              <input
                value={newAutor.apellido}
                onChange={(e) => setNewAutor((prev) => ({ ...prev, apellido: e.target.value }))}
                placeholder="Apellido"
                className={fieldClass}
              />
              <input
                value={newAutor.foto}
                onChange={(e) => setNewAutor((prev) => ({ ...prev, foto: e.target.value }))}
                placeholder="URL foto (opcional)"
                className={`${fieldClass} sm:col-span-2`}
              />
              <div className="sm:col-span-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/60 p-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Vista previa foto autor</p>
                {newAutor.foto.trim() ? (
                  <img
                    src={newAutor.foto}
                    alt="Vista previa foto del autor"
                    className="h-28 w-28 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ingresá una URL para ver la imagen.</p>
                )}
              </div>
              <textarea
                value={newAutor.biografia}
                onChange={(e) => setNewAutor((prev) => ({ ...prev, biografia: e.target.value }))}
                placeholder="Biografía (opcional)"
                className={`${fieldClass} min-h-[90px] sm:col-span-2`}
              />
            </div>
            <div className="mt-3 text-right">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-60"
              >
                <Save className="w-4 h-4" /> Crear Autor
              </button>
            </div>
          </form>

          <form onSubmit={createLibro} className="bg-white dark:bg-gray-900/80 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-5 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Crear Libro
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={newLibro.nombre}
                onChange={(e) => setNewLibro((prev) => ({ ...prev, nombre: e.target.value }))}
                placeholder="Título del libro"
                className={`${fieldClass} sm:col-span-2`}
              />

              <select
                value={newLibro.categoriaId}
                onChange={(e) => setNewLibro((prev) => ({ ...prev, categoriaId: e.target.value }))}
                className={fieldClass}
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>

              <select
                value={newLibro.autorId}
                onChange={(e) => setNewLibro((prev) => ({ ...prev, autorId: e.target.value }))}
                className={fieldClass}
              >
                <option value="">Seleccionar autor existente (opcional)</option>
                {autorOptions.map((autor) => (
                  <option key={autor.id} value={autor.id}>
                    {autor.nombre} {autor.apellido}
                  </option>
                ))}
              </select>

              <input
                value={newLibro.nombreAutor}
                onChange={(e) => setNewLibro((prev) => ({ ...prev, nombreAutor: e.target.value, autorId: '' }))}
                placeholder="Nombre autor"
                className={fieldClass}
              />

              <input
                value={newLibro.apellidoAutor}
                onChange={(e) => setNewLibro((prev) => ({ ...prev, apellidoAutor: e.target.value, autorId: '' }))}
                placeholder="Apellido autor"
                className={fieldClass}
              />

              <input
                value={newLibro.imagen}
                onChange={(e) => setNewLibro((prev) => ({ ...prev, imagen: e.target.value }))}
                placeholder="URL portada (opcional)"
                className={`${fieldClass} sm:col-span-2`}
              />
              <div className="sm:col-span-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/60 p-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Vista previa portada</p>
                {newLibro.imagen.trim() ? (
                  <img
                    src={newLibro.imagen}
                    alt="Vista previa portada del libro"
                    className="h-36 w-24 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ingresá una URL para ver la portada.</p>
                )}
              </div>

              <input
                value={newLibro.enlace}
                onChange={(e) => setNewLibro((prev) => ({ ...prev, enlace: e.target.value }))}
                placeholder="Enlace (opcional)"
                className={`${fieldClass} sm:col-span-2`}
              />

              <textarea
                value={newLibro.sinopsis}
                onChange={(e) => setNewLibro((prev) => ({ ...prev, sinopsis: e.target.value }))}
                placeholder="Sinopsis (opcional)"
                className={`${fieldClass} min-h-[90px] sm:col-span-2`}
              />
            </div>
            <div className="mt-3 text-right">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold disabled:opacity-60"
              >
                <Save className="w-4 h-4" /> Crear Libro
              </button>
            </div>
          </form>
        </div>
      </div>

      <AnimatePresence>
        {editLibroModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-700 p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Editar libro</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Modificá datos del libro y del autor asociado desde una sola pantalla.
                  </p>
                </div>
                <button
                  onClick={() => setEditLibroModal(null)}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Titulo del libro</label>
                  <input
                    value={editLibroModal.nombre}
                    onChange={(e) => setEditLibroModal((prev) => prev ? { ...prev, nombre: e.target.value } : prev)}
                    className={`mt-1 ${fieldClass}`}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Imagen del libro</label>
                  <input
                    value={editLibroModal.imagen}
                    onChange={(e) => setEditLibroModal((prev) => prev ? { ...prev, imagen: e.target.value } : prev)}
                    placeholder="https://..."
                    className={`mt-1 ${fieldClass}`}
                  />
                  <div className="mt-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900/60 p-2">
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">Vista previa portada</p>
                    {editLibroModal.imagen.trim() ? (
                      <img
                        src={editLibroModal.imagen}
                        alt="Vista previa portada"
                        className="h-28 w-20 rounded object-cover border border-gray-200 dark:border-gray-700"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400">Sin imagen</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Enlace externo</label>
                  <input
                    value={editLibroModal.enlace}
                    onChange={(e) => setEditLibroModal((prev) => prev ? { ...prev, enlace: e.target.value } : prev)}
                    placeholder="https://..."
                    className={`mt-1 ${fieldClass}`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Sinopsis</label>
                  <textarea
                    value={editLibroModal.sinopsis}
                    onChange={(e) => setEditLibroModal((prev) => prev ? { ...prev, sinopsis: e.target.value } : prev)}
                    className={`mt-1 ${fieldClass} min-h-[100px]`}
                  />
                </div>
              </div>

              <div className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">Autor asociado</h4>
                {editLibroModal.autorId ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Nombre</label>
                      <input
                        value={editLibroModal.autorNombre}
                        onChange={(e) => setEditLibroModal((prev) => prev ? { ...prev, autorNombre: e.target.value } : prev)}
                        className={`mt-1 ${fieldClass}`}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Apellido</label>
                      <input
                        value={editLibroModal.autorApellido}
                        onChange={(e) => setEditLibroModal((prev) => prev ? { ...prev, autorApellido: e.target.value } : prev)}
                        className={`mt-1 ${fieldClass}`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Imagen del autor</label>
                      <input
                        value={editLibroModal.autorFoto}
                        onChange={(e) => setEditLibroModal((prev) => prev ? { ...prev, autorFoto: e.target.value } : prev)}
                        placeholder="https://..."
                        className={`mt-1 ${fieldClass}`}
                      />
                      <div className="mt-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900/60 p-2">
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">Vista previa foto autor</p>
                        {editLibroModal.autorFoto.trim() ? (
                          <img
                            src={editLibroModal.autorFoto}
                            alt="Vista previa autor"
                            className="h-24 w-24 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <p className="text-xs text-gray-500 dark:text-gray-400">Sin imagen</p>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Biografia del autor</label>
                      <textarea
                        value={editLibroModal.autorBiografia}
                        onChange={(e) => setEditLibroModal((prev) => prev ? { ...prev, autorBiografia: e.target.value } : prev)}
                        className={`mt-1 ${fieldClass} min-h-[90px]`}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                    Este libro no tiene un autor asociado para editar desde este modal.
                  </p>
                )}
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setEditLibroModal(null)}
                  className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm font-semibold"
                >
                  Cancelar
                </button>
                <button
                  disabled={busyId === editLibroModal.libroId}
                  onClick={() => void saveLibro()}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-60"
                >
                  <Save className="w-4 h-4" /> Guardar cambios
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmToggle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-700 p-5"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {confirmToggle.activoActual ? 'Confirmar baja' : 'Confirmar reactivación'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {confirmToggle.activoActual
                  ? `Vas a dar de baja ${confirmToggle.entity} "${confirmToggle.nombre}".`
                  : `Vas a reactivar ${confirmToggle.entity} "${confirmToggle.nombre}".`}
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setConfirmToggle(null)}
                  className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => void onConfirmToggle()}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold text-white ${confirmToggle.activoActual ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                >
                  {confirmToggle.activoActual ? 'Dar de baja' : 'Reactivar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {authorWithBooksError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-700 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                  <span className="text-lg">⚠️</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  No se puede dar de baja
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                El autor <span className="font-semibold">"{authorWithBooksError.autorNombre}"</span> tiene {authorWithBooksError.booksCount} libro(s) asociado(s). Debes dar de baja los libros primero.
              </p>
              
              <div className="mb-4 bg-gray-50 dark:bg-gray-800/40 rounded-lg p-3 border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Libros a desactivar:</h4>
                <div className="space-y-2">
                  {authorWithBooksError.books.map((libro) => (
                    <div key={libro.id} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 flex-1 truncate">
                        {libro.nombre}
                      </span>
                      {libro.activo && (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-xs font-semibold">
                          Activo
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setAuthorWithBooksError(null)}
                  className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm font-semibold"
                >
                  Entendido
                </button>
                <button
                  onClick={() => {
                    setAuthorWithBooksError(null);
                    setTab('libros');
                    setEstado('activo');
                  }}
                  className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold"
                >
                  Ir a libros
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-4 right-4 z-50 max-w-sm rounded-xl px-4 py-3 shadow-xl text-sm font-medium border ${notice.type === 'success' ? 'bg-emerald-600 text-white border-emerald-400/40' : 'bg-red-600 text-white border-red-400/40'}`}
          >
            {notice.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCatalogoPage;
