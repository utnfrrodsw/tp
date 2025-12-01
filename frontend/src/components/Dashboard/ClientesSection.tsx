import DashboardSection from '../DashboardSection/DashboardSection';
import { useState, useEffect, useCallback, useRef } from 'react';
import SelectionBar from '../SelectionBar/SelectionBar';
import ItemTurno from '../itemTurno/ItemTurno';
import PaginationControls from '../../components/Pagination/PaginationControler';
import { turnosApi } from '../../services/turnosApi';
import TurnoDetailsModal from '../Modal/TurnoDetailsModal';
import ConfirmationModal from '../Modal/ConfirmationModal';
import useAuth from '../../cookie/useAuth';
import StripeConnection from '../StripeConnection/StripeConnection';
import { Alert } from '../Alerts/Alerts';

const capitalizeFirstLetter = (string: string) => {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

interface TurnoDisplay {
  id: number;
  cliente: string;
  fecha: string;
  hora: string;
  estado: string;
  tarea: string;
  avatar: string;
  monto: number;
}

// funcion para convertir datos del API al formato del item de la tabla
const convertirTurnoADisplay = (turno: any): TurnoDisplay => {
  // Tratar la fecha como hora local, no UTC
  const fechaHoraString = turno.fechaHora.replace(' ', 'T');
  const fechaHora = new Date(fechaHoraString);

  return {
    id: turno.id,
    cliente:
      turno.usuario?.nombre && turno.usuario?.apellido
        ? `${turno.usuario.nombre} ${turno.usuario.apellido}`
        : 'Usuario desconocido',
    fecha: fechaHora.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }),
    hora: fechaHoraString.slice(11, 16),
    estado: capitalizeFirstLetter(turno.estado),
    tarea: turno.servicio?.tarea?.descripcionTarea || 'Tarea no especificada',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      turno.usuario?.nombre || turno.usuario?.mail || 'Usuario'
    )}&background=f97316&color=ffffff`,
    monto: Number(turno.montoFinal) || 0,
  };
};

function ClientesSection() {
  const { usuario } = useAuth();
  const [selectedTurnoIds, setSelectedTurnoIds] = useState<number[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [turnos, setTurnos] = useState<TurnoDisplay[]>([]);
  const [pendingAction, setPendingAction] = useState<
    null | 'Confirmado' | 'Cancelado' | 'Completado'
  >(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('');
  const [estadoFilters, setEstadoFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');
  const [showEstadoDropdown, setShowEstadoDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTurnoDetails, setSelectedTurnoDetails] =
    useState<TurnoDisplay | null>(null);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isErrorAnimating, setIsErrorAnimating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 6;

  const cargarTurnos = useCallback(
    async (
      page = 1,
      ordenamiento = sortBy,
      filtrosEstado = estadoFilters,
      isPageChange = false,
      searchTerm = ''
    ) => {
      try {
        if (!usuario || !usuario.id) {
          setError('Error: Usuario no autenticado');
          setLoading(false);
          return;
        }
        if (isPageChange) {
          setLoading(true);
        }
        setError(null);
        // ordenamiento para el back
        let backendOrderValue = '';
        switch (ordenamiento) {
          case 'fecha':
            backendOrderValue = 'fechaD';
            break;
          case 'fechaAsc':
            backendOrderValue = 'fechaA';
            break;
          case 'monto':
            backendOrderValue = 'montoD';
            break;
          case 'montoMenor':
            backendOrderValue = 'montoA';
            break;
          default:
            backendOrderValue = '';
        }

        //filtro de estado para el backend
        let backendFilterValue = '';
        if (filtrosEstado.length === 1) {
          const estado = filtrosEstado[0].toLowerCase();
          if (estado === 'pendiente') backendFilterValue = 'pendientes';
          else if (estado === 'confirmado') backendFilterValue = 'confirmados';
          else if (estado === 'cancelado') backendFilterValue = 'cancelados';
          else if (estado === 'completado') backendFilterValue = 'completado';
        } else if (filtrosEstado.length > 1) {
          // si hay mas de 1 filtro envio los estados separados por coma
          backendFilterValue =
            'multipleStates:' +
            filtrosEstado.map((e) => e.toLowerCase()).join(',');
        }
        const response = await turnosApi.getByPrestadorId(
          usuario.id.toString(),
          itemsPerPage.toString(),
          page.toString(),
          backendFilterValue || 'all',
          backendOrderValue,
          searchTerm
        );
        const turnosDisplay = response.data.data.map(convertirTurnoADisplay);
        setTurnos(turnosDisplay);
        setTotalPages(response.data.pagination.totalPages);
      } catch (err: unknown) {
        console.error('Error cargando turnos:', err);
        console.error('Error completo:', JSON.stringify(err, null, 2));
        setError(
          `Error al cargar los turnos: ${
            err instanceof Error ? err.message : 'Error desconocido'
          }`
        );
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage, sortBy, estadoFilters, usuario]
  );

  useEffect(() => {
    if (currentPage === 1) {
      cargarTurnos(
        currentPage,
        sortBy,
        estadoFilters,
        false,
        activeSearchQuery
      );
    } else {
      cargarTurnos(currentPage, sortBy, estadoFilters, true, activeSearchQuery);
    }
  }, [currentPage, cargarTurnos, sortBy, estadoFilters, activeSearchQuery]);

  // manejo de busqueda, y borrado de searchquery

  const handleSearch = () => {
    setCurrentPage(1);
    setActiveSearchQuery(searchQuery);
    cargarTurnos(1, sortBy, estadoFilters, false, searchQuery);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  useEffect(() => {
    if (searchQuery.trim() === '' && activeSearchQuery !== '') {
      setActiveSearchQuery('');
      setCurrentPage(1);
      cargarTurnos(1, sortBy, estadoFilters, false, '');
    }
  }, [searchQuery, activeSearchQuery, sortBy, estadoFilters, cargarTurnos]);
  const currentTurnos = turnos;

  // helper para saber si estan todos seleccionados con boolean
  const currentPageTurnoIds = currentTurnos.map((turno) => turno.id);
  const allCurrentPageSelected =
    currentPageTurnoIds.length > 0 &&
    currentPageTurnoIds.every((id) => selectedTurnoIds.includes(id));

  useEffect(() => {
    if (selectedTurnoIds.length > 0) {
      setShowBar(true);
      setFadeOut(false);
    } else if (showBar) {
      setFadeOut(true);
      setTimeout(() => setShowBar(false), 300);
    }
  }, [selectedTurnoIds, showBar]);

  useEffect(() => {
    if (pendingAction) {
      setModalVisible(true);
    } else if (modalVisible) {
      setTimeout(() => setModalVisible(false), 200);
    }
  }, [pendingAction, modalVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowEstadoDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectRow = (idx: number) => {
    const turnoId = turnos[idx]?.id;
    if (turnoId) {
      setSelectedTurnoIds((prev) =>
        prev.includes(turnoId)
          ? prev.filter((id) => id !== turnoId)
          : [...prev, turnoId]
      );
    }
  };

  //chequea si es verdad, los deselecciona, si no los selecciona a todos
  const handleSelectAll = () => {
    if (allCurrentPageSelected) {
      setSelectedTurnoIds((prev) =>
        prev.filter((id) => !currentPageTurnoIds.includes(id))
      );
    } else {
      setSelectedTurnoIds((prev) => [
        ...new Set([...prev, ...currentPageTurnoIds]), //filtra duplicados
      ]);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUpdateEstado = (
    nuevoEstado: 'Confirmado' | 'Cancelado' | 'Completado'
  ) => {
    setPendingAction(nuevoEstado);
    setModalVisible(true);
  };
  const handleShowDetails = async () => {
    if (selectedTurnoIds.length === 0) {
      showAnimatedError('No hay turnos seleccionados');
      return;
    }

    if (selectedTurnoIds.length > 1) {
      showAnimatedError('Solo puedes ver detalles de un turno a la vez');
      return;
    }

    try {
      // chequeo local por si es un turno de esa pagina,
      // si no es de esa llama a la api.
      const turnoId = selectedTurnoIds[0];
      const turnoLocal = turnos.find((t) => t.id === turnoId);

      if (turnoLocal) {
        setSelectedTurnoDetails(turnoLocal);
        setShowDetailsModal(true);
      } else {
        const response = await turnosApi.getById(turnoId.toString());
        const turnoData = response.data.data;
        if (turnoData) {
          const turnoDisplay = convertirTurnoADisplay(turnoData);
          setSelectedTurnoDetails(turnoDisplay);
          setShowDetailsModal(true);
        }
      }
    } catch (error) {
      console.error('Error obteniendo detalles del turno:', error);
      showAnimatedError('Error al obtener los detalles del turno');
    }
  };

  const handleConfirmAction = async () => {
    if (pendingAction && selectedTurnoIds.length > 0) {
      try {
        // mapeo las respuestas de la api
        const turnosPromises = selectedTurnoIds.map((id) =>
          turnosApi.getById(id.toString())
        );
        const turnosResponses = await Promise.all(turnosPromises); //esperar todas las respuestas
        const turnosValidos: number[] = [];
        turnosResponses.forEach((response) => {
          // los completados y cancelados returnean pq no se pueden alterar
          const turno = response.data.data;
          if (!turno) return;
          const estado = turno.estado.toLowerCase();
          if (estado === 'completado' || estado === 'cancelado') {
            return;
          }

          // validar diferentes transiciones
          let esValido = false;
          if (pendingAction === 'Confirmado' && estado === 'pendiente') {
            esValido = true;
          } else if (
            pendingAction === 'Cancelado' &&
            (estado === 'pendiente' || estado === 'confirmado')
          ) {
            esValido = true;
          } else if (
            pendingAction === 'Completado' &&
            estado === 'confirmado'
          ) {
            esValido = true;
          }

          if (esValido) {
            turnosValidos.push(turno.id);
          }
        });

        // actualizar turnjos validos
        if (turnosValidos.length > 0) {
          await turnosApi.updateMultipleEstados(
            turnosValidos,
            pendingAction.toLowerCase()
          );
        }

        // actualiza turnos
        await cargarTurnos(
          currentPage,
          sortBy,
          estadoFilters,
          false,
          activeSearchQuery
        );

        setShowMenu(false);
        setSelectedTurnoIds([]);
        setPendingAction(null);
        setModalVisible(false);
      } catch (error) {
        console.error('Error actualizando turnos:', error);
        setError(
          'Error al actualizar los turnos. Por favor, intenta nuevamente.'
        );
      }
    }
  };

  const handleCancelAction = () => {
    setPendingAction(null);
    setModalVisible(false);
  };

  // cuenta turnos validos e invalidos para las otras paginas tmb
  const [validSelectedCount, setValidSelectedCount] = useState(0);
  const [invalidSelectedCount, setInvalidSelectedCount] = useState(0);
  const showAnimatedError = (message: string) => {
    setErrorMessage(message);
    setShowErrorMessage(true);
    setTimeout(() => setIsErrorAnimating(true), 10);
    setTimeout(() => {
      setIsErrorAnimating(false);
      setTimeout(() => setShowErrorMessage(false), 200);
    }, 3000);
  };

  // calcula los turnos validos e invalidos, sirve para mostrarlo
  const calculateSelectedCounts = useCallback(async () => {
    if (selectedTurnoIds.length === 0 || !pendingAction) {
      setValidSelectedCount(0);
      setInvalidSelectedCount(0);
      return;
    }
    //calcula los turnos validos e invalidos, no actualiza
    try {
      const turnosPromises = selectedTurnoIds.map((id) =>
        turnosApi.getById(id.toString())
      );
      const turnosResponses = await Promise.all(turnosPromises);

      let validCount = 0;
      let invalidCount = 0;

      turnosResponses.forEach((response) => {
        const turno = response.data.data;
        if (!turno) {
          invalidCount++;
          return;
        }
        const estado = turno.estado.toLowerCase();
        if (estado === 'completado' || estado === 'cancelado') {
          invalidCount++;
          return;
        }
        let esValido = false;
        if (pendingAction === 'Confirmado' && estado === 'pendiente') {
          esValido = true;
        } else if (
          pendingAction === 'Cancelado' &&
          (estado === 'pendiente' || estado === 'confirmado')
        ) {
          esValido = true;
        } else if (pendingAction === 'Completado' && estado === 'confirmado') {
          esValido = true;
        }

        if (esValido) {
          validCount++;
        } else {
          invalidCount++;
        }
      });

      setValidSelectedCount(validCount);
      setInvalidSelectedCount(invalidCount);
    } catch (error) {
      console.error('Error calculando turnos válidos/inválidos:', error);
      setValidSelectedCount(0);
      setInvalidSelectedCount(selectedTurnoIds.length);
    }
  }, [selectedTurnoIds, pendingAction]);

  // Ejecutar cálculo cuando cambia pendingAction o selectedTurnoIds
  useEffect(() => {
    if (pendingAction) {
      calculateSelectedCounts();
    }
  }, [pendingAction, calculateSelectedCounts]);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileLayout(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  // manejar el cambio de ordenamiento o sea sortBy
  const handleSortSelect = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
    cargarTurnos(1, newSortBy, estadoFilters, false, activeSearchQuery);
  };

  // manejar los filtros de estado
  const handleEstadoFilterChange = (estado: string) => {
    const newFilters = estadoFilters.includes(estado)
      ? estadoFilters.filter((f) => f !== estado)
      : [...estadoFilters, estado];

    setEstadoFilters(newFilters);
    setCurrentPage(1);
    cargarTurnos(1, sortBy, newFilters, false, activeSearchQuery);
  };

  const clearEstadoFilters = () => {
    setEstadoFilters([]);
    setCurrentPage(1);
    cargarTurnos(1, sortBy, [], false, activeSearchQuery);
  };

  const estadosDisponibles = [
    'Pendiente',
    'Confirmado',
    'Cancelado',
    'Completado',
  ];

  if (loading) {
    return (
      <DashboardSection>
        <StripeConnection loadingMessage="Cargando información de clientes...">
          <div className="flex items-center justify-center h-48 sm:h-64 px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">
                Cargando turnos...
              </p>
            </div>
          </div>
        </StripeConnection>
      </DashboardSection>
    );
  }

  // Mostrar error - responsive
  if (error) {
    return (
      <DashboardSection>
        <StripeConnection loadingMessage="Cargando información de clientes...">
          <div className="text-center py-6 sm:py-8 px-4">
            <div className="text-red-500 mb-4 text-sm sm:text-base">
              {error}
            </div>
            <button
              onClick={() =>
                cargarTurnos(
                  currentPage,
                  sortBy,
                  estadoFilters,
                  false,
                  activeSearchQuery
                )
              } // Mantener búsqueda activa
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm sm:text-base"
            >
              Reintentar
            </button>
          </div>
        </StripeConnection>
      </DashboardSection>
    );
  }

  return (
    <DashboardSection title="Mis turnos">
      <StripeConnection loadingMessage="Cargando información de clientes...">
        <div
          className={`mb-4 sm:mb-6 flex ${
            isMobileLayout ? 'flex-col' : 'flex-col sm:flex-row'
          } ${
            isMobileLayout ? '' : 'sm:items-center sm:justify-between'
          } gap-3 sm:gap-2 px-2 sm:px-0 relative`}
        >
          <div
            className={`flex ${
              isMobileLayout ? 'flex-col' : 'flex-col sm:flex-row'
            } gap-2 sm:gap-2 relative`}
          >
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`${
                isMobileLayout ? 'w-full' : 'w-full sm:w-auto'
              } border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
            />
            {/* dropdown ordenar*/}
            <div
              ref={sortDropdownRef}
              className={`relative ${
                isMobileLayout ? 'w-full' : 'w-full sm:w-auto'
              }`}
            >
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className={`${
                  isMobileLayout ? 'w-full' : 'w-full sm:w-auto'
                } border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 flex items-center ${
                  isMobileLayout
                    ? 'justify-between'
                    : 'justify-between sm:justify-center'
                } gap-2`}
              >
                <span>
                  {sortBy === ''
                    ? 'Ordenar por'
                    : sortBy === 'fecha'
                    ? 'Fecha (más reciente)'
                    : sortBy === 'fechaAsc'
                    ? 'Fecha (más antigua)'
                    : sortBy === 'monto'
                    ? 'Monto (mayor)'
                    : sortBy === 'montoMenor'
                    ? 'Monto (menor)'
                    : 'Ordenar por'}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    showSortDropdown ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showSortDropdown && (
                <div
                  className={`absolute top-full right-0 mt-1 ${
                    isMobileLayout ? 'w-full' : 'w-full sm:w-48'
                  } bg-white border border-gray-300 rounded-lg shadow-lg z-20`}
                >
                  <div className="p-1">
                    <button
                      onClick={() => {
                        handleSortSelect('');
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                        sortBy === ''
                          ? 'bg-orange-50 text-orange-700'
                          : 'text-gray-700'
                      }`}
                    >
                      Ordenar por
                    </button>
                    <button
                      onClick={() => {
                        handleSortSelect('fecha');
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                        sortBy === 'fecha'
                          ? 'bg-orange-50 text-orange-700'
                          : 'text-gray-700'
                      }`}
                    >
                      Fecha (más reciente)
                    </button>
                    <button
                      onClick={() => {
                        handleSortSelect('fechaAsc');
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                        sortBy === 'fechaAsc'
                          ? 'bg-orange-50 text-orange-700'
                          : 'text-gray-700'
                      }`}
                    >
                      Fecha (más antigua)
                    </button>
                    <button
                      onClick={() => {
                        handleSortSelect('monto');
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                        sortBy === 'monto'
                          ? 'bg-orange-50 text-orange-700'
                          : 'text-gray-700'
                      }`}
                    >
                      Monto (mayor)
                    </button>
                    <button
                      onClick={() => {
                        handleSortSelect('montoMenor');
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                        sortBy === 'montoMenor'
                          ? 'bg-orange-50 text-orange-700'
                          : 'text-gray-700'
                      }`}
                    >
                      Monto (menor)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* dropdown filtros*/}
            <div
              className={`relative ${
                isMobileLayout ? 'w-full' : 'w-full sm:w-auto'
              }`}
              ref={dropdownRef}
            >
              <button
                onClick={() => setShowEstadoDropdown(!showEstadoDropdown)}
                className={`${
                  isMobileLayout ? 'w-full' : 'w-full sm:w-auto'
                } border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 flex items-center ${
                  isMobileLayout
                    ? 'justify-between'
                    : 'justify-between sm:justify-center'
                } gap-2`}
              >
                <span>
                  Filtrar por{' '}
                  {estadoFilters.length > 0 && `(${estadoFilters.length})`}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    showEstadoDropdown ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showEstadoDropdown && (
                <div
                  className={`absolute top-full right-0 mt-1 ${
                    isMobileLayout ? 'w-full' : 'w-full sm:w-48'
                  } bg-white border border-gray-300 rounded-lg shadow-lg z-20`}
                >
                  <div className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Estados
                      </span>
                      {estadoFilters.length > 0 && (
                        <button
                          onClick={clearEstadoFilters}
                          className="text-xs text-orange-600 hover:text-orange-700"
                        >
                          Limpiar
                        </button>
                      )}
                    </div>
                    {estadosDisponibles.map((estado) => (
                      <label
                        key={estado}
                        className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 rounded px-1"
                      >
                        <input
                          type="checkbox"
                          checked={estadoFilters.includes(estado)}
                          onChange={() => handleEstadoFilterChange(estado)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{estado}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow relative mx-2 sm:mx-0">
          <table className="min-w-full text-xs sm:text-sm table-fixed">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                  <span className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={allCurrentPageSelected}
                      onChange={handleSelectAll}
                      className="peer h-4 w-4 sm:h-5 sm:w-5 rounded border border-gray-500 bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500 checked:bg-orange-500 checked:border-orange-500"
                    />
                    <span className="absolute pointer-events-none inset-0 flex items-center justify-center">
                      {allCurrentPageSelected && (
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 block"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M5 10.5L9 14.5L15 7.5"
                            stroke="#fff"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                  </span>
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm">
                  Cliente
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm hidden sm:table-cell">
                  Fecha
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm hidden sm:table-cell">
                  Hora
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm min-w-[150px] sm:min-w-[220px]">
                  Tarea
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm">
                  Monto
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTurnos.length > 0 ? (
                currentTurnos.map((turno, idx) => (
                  <ItemTurno
                    key={turno.id}
                    turno={turno}
                    idx={idx}
                    selected={selectedTurnoIds.includes(turno.id)}
                    onSelect={handleSelectRow}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-6 sm:py-8 text-center">
                    <p className="text-gray-400 opacity-60 text-sm sm:text-base px-4">
                      {activeSearchQuery
                        ? 'No se encontraron turnos que coincidan con tu búsqueda.'
                        : 'No hay turnos disponibles.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* paginacion */}
          <div
            className={`mt-2 flex items-center justify-center sm:justify-end px-2 sm:px-0 ${
              currentTurnos.length > 0 ? 'min-h-[60px]' : 'min-h-[20px]'
            }`}
          >
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

          {showErrorMessage && (
            <Alert
              variant="danger"
              autoClose
              autoCloseDelay={3000}
              className={`fixed left-1/2 bottom-16 sm:bottom-24 transform -translate-x-1/2 z-50 shadow-lg max-w-[90vw] sm:max-w-none transition-all duration-200 ${
                isErrorAnimating
                  ? 'scale-100 opacity-100'
                  : 'scale-95 opacity-0'
              }`}
              onClose={() => setShowErrorMessage(false)}
            >
              {errorMessage}
            </Alert>
          )}
          {showBar && (
            <SelectionBar
              selectedCount={selectedTurnoIds.length}
              onDeselectAll={() => {
                setFadeOut(true);
                setTimeout(() => setSelectedTurnoIds([]), 300);
              }}
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              fadeOut={fadeOut}
              onConfirm={() => handleUpdateEstado('Confirmado')}
              onCancel={() => handleUpdateEstado('Cancelado')}
              onComplete={() => handleUpdateEstado('Completado')}
              onShowDetails={handleShowDetails}
            />
          )}

          {/* modal de confirmacion */}
          <ConfirmationModal
            isVisible={modalVisible}
            pendingAction={pendingAction}
            validSelectedCount={validSelectedCount}
            invalidSelectedCount={invalidSelectedCount}
            onConfirm={handleConfirmAction}
            onCancel={handleCancelAction}
          />

          {/* modal de detalles del turno */}
          <TurnoDetailsModal
            isVisible={showDetailsModal}
            turnoDetails={selectedTurnoDetails}
            onClose={() => setShowDetailsModal(false)}
          />
        </div>
      </StripeConnection>
    </DashboardSection>
  );
}

export default ClientesSection;
