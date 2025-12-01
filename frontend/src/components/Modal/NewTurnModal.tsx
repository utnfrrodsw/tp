import { useEffect, useState } from 'react';
import CustomSelect from '../Select/CustomSelect';
import { turnosApi } from '../../services/turnosApi';
import { useRoleReturn } from '../../cookie/useProtectRoute.tsx';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

// Esquema simplificado que valida todo de una vez
const turnFormSchema = z.object({
  selectedService: z.string().min(1, 'Debe seleccionar un tipo de servicio'),
  selectedTask: z.string().min(1, 'Debe seleccionar una tarea'),
  dayForTurn: z
    .string()
    .min(1, 'Debe seleccionar una fecha')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
  horarioSelected: z
    .string()
    .min(1, 'Debe seleccionar un horario')
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horario inválido'),
});

// Schema para validar datos finales antes del envío
const apiDataSchema = z.object({
  servicio: z.number().positive(),
  fechaHora: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/),
  estado: z.literal('pendiente'),
  montoFinal: z.number().positive(),
});

// cuando apriero esc que se salga del menu
type Usuario = {
  id: number;
  nombre: string;
  apellido: string;
  foto: string;
  mail: string;
  telefono: string;
  tiposDeServicio: TipoDeServicio[];
  horarios: {
    id: number;
    diaSemana: number;
    horaDesde: string;
    horaHasta: string;
  }[];
  servicios: Servicio[];
};
type TipoDeServicio = {
  id: number;
  nombreTipo: string;
};

type Servicio = {
  id: number;
  precio: number;
  tarea: Tarea;
};

type Tarea = {
  id: number;
  nombreTarea: string;
  descripcionTarea: string;
  duracion: number;
  tipoServicio: TipoDeServicio;
};

type Option = {
  value: string;
  label: string;
};

type Props = {
  prestatario: Usuario;
  setopen: (open: boolean) => void;

  servicio?: string;
  Tarea?: string;
  horario?: string;
  dia?: string;
  open?: string;
  manejoAlertas: (
    alert: { tipo: string; error: string; message: string } | null
  ) => void;
  montofinall: number;
};

function NewTurnModal({
  prestatario,
  setopen,
  servicio = '',
  Tarea = 'lala',
  horario = '',
  dia = '',
  open,
  montofinall,
  manejoAlertas,
}: Props) {
  const [montofinal, setMontofinal] = useState(montofinall);
  const navigate = useNavigate();
  // Verificar si el usuario ha iniciado sesión
  const rol = useRoleReturn();
  // variables para manejar las devolvuciones del back

  // Valida y sanitiza los parámetros iniciales recibidos por props/URL
  // Devuelve un objeto con errores encontrados o null si todo está válido
  const validateInitialParams = () => {
    const errors: Record<string, string> = {};
    // Validar servicio inicial
    if (
      servicio &&
      !prestatario.tiposDeServicio.some((tipo) => tipo.nombreTipo === servicio)
    ) {
      errors.initialService = 'Servicio inicial no válido';
    }

    // Validar tarea inicial solo si el servicio inicial es válido
    if (
      servicio &&
      Tarea &&
      !prestatario.servicios.some(
        (serv) =>
          serv.tarea.nombreTarea === Tarea &&
          serv.tarea.tipoServicio.nombreTipo === servicio
      )
    ) {
      errors.initialTask = 'Tarea inicial no válida';
    }

    // Validar horario inicial
    if (horario && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(horario)) {
      errors.initialHorario = 'Horario inicial no válido';
    }

    // Validar día inicial
    if (
      dia &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(dia) ||
        new Date(dia) < new Date(new Date().toDateString()))
    ) {
      errors.initialDia = 'Fecha inicial no válida';
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };

  // Validar parámetros iniciales una sola vez al cargar el componente
  const initialValidationErrors = validateInitialParams();

  // Variables de estado para las opciones de los selects
  const serviciosoptions: Option[] = [];
  const [tareasOptions, setTareasOptions] = useState<Option[]>([]);
  // Estados para horarios disponibles divididos por mañana y tarde
  const [horariosManana, setHorariosManana] = useState<number[]>([]);
  const [horariosTarde, setHorariosTarde] = useState<number[]>([]);

  // Estados principales del formulario (se inicializan vacíos si hay errores en parámetros iniciales)
  const [dayForTurn, setDayForTurn] = useState(
    initialValidationErrors ? '' : dia || ''
  );
  const [horarioSelected, setHorarioSelected] = useState(
    initialValidationErrors ? '' : horario || ''
  );
  const [selectedService, setSelectedService] = useState(
    initialValidationErrors ? '' : servicio || ''
  );
  // Estados para navegación del modal
  const [page, setPage] = useState(1); // Página actual del modal (1: selección, 2: horarios)
  const [diasPage, setDiasPage] = useState(1); // Página de navegación de días (6 días por página)
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(
    initialValidationErrors ? false : open === 'true'
  );
  const [selectedTask, setSelectedTask] = useState(
    initialValidationErrors ? '' : Tarea || ''
  );

  // Estados para manejar errores de validación
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isValidating, setIsValidating] = useState(false);

  // Función de validación simplificada usando Zod
  // Valida el paso específico: 'service', 'datetime' o 'all' para todo el formulario
  // Devuelve true si la validación es exitosa, false si hay errores
  const validateForm = (step?: 'service' | 'datetime' | 'all') => {
    const formData = {
      selectedService,
      selectedTask,
      dayForTurn,
      horarioSelected,
    };

    try {
      if (step === 'service') {
        // Solo validar servicio y tarea
        z.object({
          selectedService: turnFormSchema.shape.selectedService,
          selectedTask: turnFormSchema.shape.selectedTask,
        }).parse({ selectedService, selectedTask });
      } else if (step === 'datetime') {
        // Solo validar fecha y hora
        z.object({
          dayForTurn: turnFormSchema.shape.dayForTurn,
          horarioSelected: turnFormSchema.shape.horarioSelected,
        }).parse({ dayForTurn, horarioSelected });
      } else {
        // Validar todo
        turnFormSchema.parse(formData);
      }

      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            errors[issue.path[0] as string] = issue.message;
          }
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  // Valida que los valores seleccionados pertenezcan realmente al prestatario
  // Previene inyección de datos maliciosos a través de manipulación del DOM
  // type: tipo de valor a validar ('service' | 'task')
  // value: valor a validar
  // Devuelve true si el valor es válido para el prestatario
  const isValidValue = (type: string, value: string): boolean => {
    switch (type) {
      case 'service':
        return (
          value === '' ||
          prestatario.tiposDeServicio.some((tipo) => tipo.nombreTipo === value)
        );
      case 'task':
        return (
          value === '' ||
          prestatario.servicios.some(
            (serv) =>
              serv.tarea.nombreTarea === value &&
              serv.tarea.tipoServicio.nombreTipo === selectedService
          )
        );
      default:
        return true;
    }
  };

  // Efecto para desactivar el scroll del body cuando el modal está abierto
  useEffect(() => {
    // Desactivar scroll del body
    document.body.style.overflow = 'hidden';

    // Cleanup: restaurar scroll cuando el componente se desmonte
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Efecto para manejar el cierre del modal con la tecla Escape
  useEffect(() => {
    // Maneja el evento de teclado para cerrar el modal con Escape
    // event: evento de teclado
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setopen(false);
      }
    };

    // Agregar listener de teclado
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup: remover listener cuando el componente se desmonte
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setopen]);

  // Efecto para generar las opciones de tareas según el servicio seleccionado
  useEffect(() => {
    const newTareasOptions: Option[] = [];
    const seenTasks = new Set(); // Conjunto para evitar duplicados

    prestatario.servicios.forEach((servicio) => {
      if (
        servicio.tarea.tipoServicio.nombreTipo === selectedService &&
        !seenTasks.has(servicio.tarea.nombreTarea) // Verificar si ya se agregó
      ) {
        newTareasOptions.push({
          value: servicio.tarea.nombreTarea,
          label: servicio.tarea.nombreTarea,
        });
        seenTasks.add(servicio.tarea.nombreTarea); // Marcar como agregado
      }
    });

    setTareasOptions(newTareasOptions);
  }, [selectedService, prestatario]);

  // Efecto principal para obtener y calcular horarios disponibles
  useEffect(() => {
    // Genera los horarios disponibles basándose en los horarios del prestatario y turnos ocupados
    // horaDesde: hora de inicio del horario laboral (formato "HH:MM:SS")
    // horaHasta: hora de fin del horario laboral (formato "HH:MM:SS")
    // turnosOcupados: array de arrays con [inicio, fin] de turnos ya ocupados en minutos
    // dayForTurn: fecha seleccionada en formato ISO
    const generateHorarios = (
      horaDesde: string,
      horaHasta: string,
      turnosOcupados: number[][] = [],
      dayForTurn: string
    ) => {
      // Convierte "08:00:00" a minutos totales
      const [hDesde, mDesde] = horaDesde.split(':').map(Number);
      const [hHasta, mHasta] = horaHasta.split(':').map(Number);
      let horaAct = hDesde * 60 + mDesde; // Hora actual en minutos

      // Si el día seleccionado es hoy, usar la hora actual como mínimo
      if (dayForTurn === new Date().toISOString().split('T')[0]) {
        const ahora = new Date();
        let horaActualEnMinutos =
          (ahora.getHours() + 1) * 60 + ahora.getMinutes();
        // Redondear para arriba al próximo múltiplo de 30 (00 o 30)
        if (horaActualEnMinutos % 30 !== 0) {
          horaActualEnMinutos += 30 - (horaActualEnMinutos % 30);
        }
        horaAct = Math.max(horaAct, horaActualEnMinutos);
      }
      const horaHastaMin = hHasta * 60 + mHasta;
      const taskDuration =
        prestatario.servicios.find(
          (servicio) => servicio.tarea.nombreTarea === selectedTask
        )?.tarea.duracion || 30;

      const nuevosHorariosManana: number[] = [];
      const nuevosHorariosTarde: number[] = [];
      while (horaAct + taskDuration <= horaHastaMin) {
        // Es la suma de arranque mas la duracion para ver que entre la tarea completa y no se solapen
        const finNuevoTurno = horaAct + taskDuration;

        // Verificar si el turno con la duracion entra o se solapa
        const haySolapamiento = turnosOcupados.some(
          ([inicioOcupado, finOcupado]) => {
            // No entra si arranca antes de que termine el turno o termina despues de que arranca un turno
            return horaAct < finOcupado && finNuevoTurno > inicioOcupado;
          }
        );

        if (!haySolapamiento) {
          if (horaAct < 13 * 60) {
            nuevosHorariosManana.push(horaAct);
          } else {
            nuevosHorariosTarde.push(horaAct);
          }
        }

        horaAct += 30; // Incrementar en 30 minutos
      }
      setHorariosManana(nuevosHorariosManana);
      setHorariosTarde(nuevosHorariosTarde);
    };
    // Obtiene los turnos ocupados para el día seleccionado desde la API
    // y genera los horarios disponibles considerando las ocupaciones
    const fetchHorarios = async () => {
      try {
        if (dayForTurn) {
          const response = await turnosApi.getTurnsPerDay(
            prestatario.id.toString(),
            dayForTurn
          );

          // Crear array de rangos de tiempo ocupados [inicio, fin] en minutos
          const turnosOcupados: number[][] = [];
          response.data.data.forEach(
            (turno: {
              fechaHora: string;
              servicio: { tarea: { duracionTarea: number } };
            }) => {
              const minutosInicio =
                new Date(turno.fechaHora).getHours() * 60 +
                new Date(turno.fechaHora).getMinutes();

              turnosOcupados.push([
                minutosInicio,
                minutosInicio + Number(turno.servicio.tarea.duracionTarea),
              ]);
            }
          );

          // Buscar el horario de trabajo del prestatario para el día seleccionado
          for (const horario of prestatario.horarios) {
            if (horario.diaSemana === new Date(dayForTurn).getDay()) {
              generateHorarios(
                horario.horaDesde,
                horario.horaHasta,
                turnosOcupados,
                dayForTurn
              );
              break; // Solo necesitamos el primer horario que coincida
            }
          }
        }
      } catch (error: any) {
        manejoAlertas({
          tipo: 'error',
          error: 'fetch_error',
          message:
            error.response?.data?.error ||
            error.message ||
            'Error al obtener los horarios',
        });
        console.error('Error fetching horarios:', error);
      }
    };
    // Ejecutar la búsqueda de horarios
    fetchHorarios();
  }, [
    dayForTurn,
    prestatario.id,
    prestatario.horarios,
    prestatario.servicios,
    selectedTask,
    manejoAlertas,
  ]); // Re-ejecutar cuando cambien estos valores

  // Convierte minutos desde medianoche a formato de hora HH:MM
  // minutos: número de minutos desde las 00:00
  // Devuelve hora en formato "HH:MM"
  const minutosAHora = (minutos: number): string => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}`;
  };

  // Genera los botones de días disponibles para selección
  // Muestra 6 días a la vez con navegación por páginas
  // Devuelve grid con botones de días
  const mostrarDias = () => {
    const primerDia = new Date();
    primerDia.setDate(primerDia.getDate() + (diasPage - 1) * 6);
    const dias = [
      ['Domingo', 'Dom'],
      ['Lunes', 'Lun'],
      ['Martes', 'Mar'],
      ['Miércoles', 'Mie'],
      ['Jueves', 'Jue'],
      ['Viernes', 'Vie'],
      ['Sábado', 'Sab'],
    ];
    const botonesDias = [];

    for (let i = 0; i < 6; i++) {
      const fecha = new Date(primerDia);
      fecha.setDate(primerDia.getDate() + i);
      const diaIndex = fecha.getDay();

      botonesDias.push(
        <>
          <button
            onClick={() => {
              const dateStr = fecha.toISOString().split('T')[0];
              // Validar que la fecha no sea anterior a hoy antes de seleccionarla
              if (new Date(dateStr) >= new Date(new Date().toDateString())) {
                setDayForTurn(dateStr);
              }
            }}
            className={
              dayForTurn === fecha.toISOString().split('T')[0]
                ? 'sm:block hidden  bg-naranja-1  rounded-md w-25 m-auto text-white py-2  border-2 border-naranja-1  items-center  text-center  justify-center transition-colors duration-300'
                : 'sm:flex hidden bg-neutral-200 rounded-md py-2 w-25 m-auto px-4 hover:bg-neutral-400 text-center  flex-col'
            }
          >
            {fecha.getDate().toString().padStart(2, '0')}-
            {(fecha.getMonth() + 1).toString().padStart(2, '0')}
            <br />
            {dias[diaIndex][0]}
          </button>
          <button
            onClick={() => {
              const dateStr = fecha.toISOString().split('T')[0];
              // Validar que la fecha no sea anterior a hoy antes de seleccionarla (versión móvil)
              if (new Date(dateStr) >= new Date(new Date().toDateString())) {
                setDayForTurn(dateStr);
              }
            }}
            className={
              dayForTurn === fecha.toISOString().split('T')[0]
                ? 'mt-4 sm:hidden bg-naranja-1 border-none rounded-md w-25 m-auto text-white  hover:bg-neutral-200 border-2 border-naranja-1 hover:text-naranja-1 transition-colors duration-300'
                : 'mt-4 sm:hidden flex bg-neutral-200 rounded-md w-25 m-auto  hover:bg-neutral-400 text-center flex-col'
            }
          >
            {fecha.getDate().toString().padStart(2, '0')} -
            {(fecha.getMonth() + 1).toString().padStart(2, '0')}
            <br />
            {dias[diaIndex][1]}
          </button>
        </>
      );
    }

    return (
      <div className="grid grid-cols-3  md:grid-cols-6 sm:gap-2 mt-2 mb-4 w-full ">
        {botonesDias}
      </div>
    );
  };

  // Poblar las opciones de servicios disponibles del prestatario
  prestatario.tiposDeServicio.forEach((tipo) => {
    serviciosoptions.push({ value: tipo.nombreTipo, label: tipo.nombreTipo });
  });

  // Función principal para guardar el turno
  // Realiza validaciones completas y envía los datos a la API
  // Maneja estados de carga y errores
  const guardarTurno = async () => {
    setIsValidating(true);
    try {
      // Validar formulario completo
      if (!validateForm('all')) {
        setIsValidating(false);
        return;
      }

      // Buscar el servicio correspondiente a la tarea seleccionada
      const services = prestatario.servicios.find(
        (s) => s.tarea.nombreTarea === selectedTask
      );

      if (!services) {
        setValidationErrors({
          general: 'Servicio no encontrado para la tarea seleccionada',
        });
        setIsValidating(false);
        return;
      }

      const precio = services.precio || 100;
      const turnData = {
        servicio: services.id, // Usar el ID del servicio encontrado
        fechaHora: `${dayForTurn}T${horarioSelected}:00`,
        estado: 'pendiente' as const,
        montoFinal: precio * 1.05, // Convertir a centavos
      };

      // Log para verificar los datos enviados
      console.log('Datos enviados al backend:', turnData);

      // Validar datos para API
      apiDataSchema.parse(turnData);

      await turnosApi.createWithCookie(turnData);

      // Limpiar formulario
      setSelectedService('');
      setSelectedTask('');
      setDayForTurn('');
      setHorarioSelected('');
      setValidationErrors({});
      setopen(false);
      setConfirmationModalOpen(false);
      manejoAlertas({
        tipo: 'success',
        error: 'success',
        message: 'Turno guardado exitosamente',
      });
      setPage(1);
    } catch (error: any) {
      manejoAlertas({
        tipo: 'danger',
        error: 'save_error',
        message:
          error.response?.data?.error ||
          error.message ||
          'Error al guardar el turno',
      });
      console.error('Error al guardar el turno:', error);
      setValidationErrors({
        general: 'Error al guardar el turno. Por favor, intente nuevamente.',
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-5 backdrop-blur-xs bg-opacity-40"
      onClick={() => {
        setopen(false); // Cerrar modal al hacer click fuera del contenido
      }}
    >
      {/* Modal de confirmación de turno */}
      <div
        className={
          confirmationModalOpen
            ? 'bg-white md:rounded-lg md:shadow-2xl sm:p-10 text-black sm:w-auto flex flex-col lg:min-h-6/12 md:h-auto w-full h-screen pt-10 sm:max-h-10/12 overflow-y-auto gap-4'
            : 'hidden'
        }
        onClick={(e) => {
          e.stopPropagation(); // Prevenir cierre al hacer click dentro del modal
        }}
      >
        <div className="flex justify-end z-30 bg-transparent w-auto">
          <button
            onClick={() => {
              setConfirmationModalOpen(false);
              setopen(false);
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 "
            aria-label="Cerrar modal"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <h1 className="text-3xl font-bold -mt-14 sm:p-0 px-15 ">
          Confirmacion del Turno:
        </h1>
        <h2 className="text-2xl ">
          Prestatario: {prestatario.nombre} {prestatario.apellido}
        </h2>
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-row px-5 sm:p-0">
            <div className="flex flex-col items-start gap-3 mb-4   lg:ml-11 ">
              <p>Mail: </p>
              <p>Telefono: </p>
              <p>Servicio: </p>
              <p>Tarea: </p>
              <p>Dia: </p>
              <p>Hora: </p>
              <p>Monto: </p>
            </div>
            <div className="flex flex-col items-start gap-3 mb-4 ml-11">
              <p>{prestatario.mail}</p>
              <p>{prestatario.telefono}</p>
              <p>{selectedService}</p>
              <p>{selectedTask}</p>
              <p>{dayForTurn}</p>
              <p>{horarioSelected}</p>
              <p>{montofinal.toFixed(2)} USD</p>
            </div>
          </div>
          <div className="flex sm:flex-col sm:p-0 px-3 items-start gap-7 mb-4 sm:ml-11 h-full justify-between mt-4">
            <button
              onClick={() => {
                setopen(false);
                setConfirmationModalOpen(false);
                setSelectedService('');
                setDayForTurn('');
                setHorarioSelected('');
              }}
              className="bg-red-500 rounded-md w-full py-2 px-4 hover:bg-white hover:text-red-500 text-white border-2 border-red-500 text-center "
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                setConfirmationModalOpen(false);
                setPage(1);
              }}
              className="bg-blue-950 text-md w-full text-white border-2 border-blue-950 hover:text-blue-950 rounded-md py-2 px-7 hover:bg-white text-center "
            >
              Editar
            </button>

            <button
              className={
                rol === ''
                  ? 'bg-gray-300 border-2 w-full border-gray-500 text-white rounded-md py-2 px-4 text-center relative group'
                  : isValidating
                  ? 'bg-gray-400 border-2 w-full border-gray-400 text-white rounded-md py-2 px-4 text-center cursor-not-allowed'
                  : 'bg-green-700 border-2 w-full border-green-700 text-white rounded-md py-2 px-4 hover:bg-white hover:text-green-700 text-center'
              }
              onClick={
                rol === ''
                  ? () =>
                      navigate(
                        `/login/${prestatario.id.toString()}/${selectedService}/${selectedTask}/${horarioSelected}/${dayForTurn}/${montofinal}`
                      )
                  : guardarTurno
              }
              disabled={isValidating}
            >
              {isValidating ? 'Guardando...' : 'Confirmar'}
              {rol === '' && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-50">
                  Inicia sesión para poder sacar un turno
                </span>
              )}
            </button>
            {/* Mostrar errores de validación en el modal de confirmación */}
            {validationErrors.general && (
              <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
                {validationErrors.general}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modal principal para selección de turno */}
      <div
        className={
          confirmationModalOpen
            ? 'hidden'
            : 'bg-white md:rounded-lg md:shadow-2xl py-10 items-start text-black lg:w-6/12 md:w-180 flex flex-col lg:min-h-6/12  w-full h-screen md:max-h-[85vh]  md:h-auto overflow-y-auto gap-4'
        }
        onClick={(e) => {
          e.stopPropagation(); // Prevenir cierre al hacer click dentro del modal
        }}
      >
        <div className="flex justify-end ml-auto z-30 bg-transparent w-auto">
          <button
            onClick={() => setopen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Cerrar modal"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <h1 className="text-2xl font-bold -mt-13 px-10">Sacar turno</h1>
        <h2 className="text-xl font-bold px-10">
          Prestatario: {prestatario.nombre} {prestatario.apellido}
        </h2>
        <h2 className="px-10">Contacto:</h2>
        <h2 className="px-10">- {prestatario.mail}</h2>
        <h2 className="px-10">- {prestatario.telefono}</h2>

        {/* Alerta de errores en parámetros iniciales */}
        {initialValidationErrors && (
          <div className="mx-10 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-semibold">
              Los parámetros iniciales contienen datos inválidos:
            </p>
            <ul className="list-disc list-inside mt-2">
              {Object.values(initialValidationErrors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Página 1: Selección de servicio y tarea */}
        {page === 1 && (
          <div className="px-10 w-full gap-4 ">
            <div className="w-full">
              {/* Selector de tipo de servicio */}
              <CustomSelect
                Name="Tipo Servicios"
                options={serviciosoptions}
                setOptions={(value) => {
                  if (isValidValue('service', value)) {
                    setSelectedService(value);
                    if (value !== selectedService) setSelectedTask(''); // Limpiar tarea al cambiar servicio
                  }
                }}
                value={selectedService}
              />
              {validationErrors.selectedService && (
                <p className="text-red-500 text-sm mt-1 ml-2">
                  {validationErrors.selectedService}
                </p>
              )}
            </div>
            <div className="w-full mt-5 ">
              {/* Selector de tarea específica del servicio */}
              <CustomSelect
                Name={
                  selectedService ? 'Tareas' : 'Seleccione un servicios antes'
                }
                options={tareasOptions}
                setOptions={(value) => {
                  if (isValidValue('task', value)) {
                    setSelectedTask(value);
                    console.log('Tarea seleccionada:', value, selectedTask);
                  }
                }}
                value={selectedTask}
              />
              {validationErrors.selectedTask && (
                <p className="text-red-500 text-sm mt-1 ml-2">
                  {validationErrors.selectedTask}
                </p>
              )}
            </div>
            {validationErrors.general && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {validationErrors.general}
              </div>
            )}
          </div>
        )}

        {/* Página 2: Selección de fecha y horario */}
        {page === 2 && (horariosManana || horariosTarde) && (
          <div className="w-full ">
            <h2 className="text-xl font-bold">Dias Disponibles:</h2>
            <div className="flex flex-row justify-between items-center w-full ">
              <button
                onClick={() => setDiasPage((prev) => Math.max(prev - 1, 1))}
              >
                <svg
                  width="32"
                  height="40"
                  viewBox="0 0 24 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={
                    diasPage === 1
                      ? 'color-neutral-300 cursor-not-allowed rounded p-1 sm:w-full w-6'
                      : 'cursor-pointer hover:bg-gray-100 rounded p-1  sm:w-full w-6'
                  }
                >
                  <path
                    d="M15 22L9 15L15 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {mostrarDias()}
              <button onClick={() => setDiasPage((prev) => Math.min(prev + 1))}>
                <svg
                  width="32"
                  height="40"
                  viewBox="0 0 24 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="cursor-pointer hover:bg-gray-100 rounded p-1 sm:w-full w-6"
                  style={{ transform: 'rotate(180deg)' }}
                >
                  <path
                    d="M15 22L9 15L15 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <h2 className="text-xl font-bold">Horarios Disponibles:</h2>
            {horariosManana.length === 0 && horariosTarde.length === 0 ? (
              <p className="text-red-500 text-xl my-6">
                No hay horarios disponibles para la fecha seleccionada.
              </p>
            ) : (
              <>
                <h2>Mañana:</h2>
                {horariosManana.length === 0 ? (
                  <p className="text-red-500 text-xl m-6">
                    No hay horarios disponibles en la mañana para la fecha
                    seleccionada.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2 mt-5 px-7">
                    {horariosManana.map((horario) => (
                      <button
                        key={`manana-${horario}`}
                        className={
                          minutosAHora(horario) === horarioSelected
                            ? 'bg-naranja-1 border-none rounded-md text-white px-6 py-2 hover:bg-neutral-200 border-2 border-naranja-1 hover:text-naranja-1 transition-colors duration-300'
                            : 'bg-neutral-200 rounded-md py-2 hover:bg-neutral-400'
                        }
                        onClick={() =>
                          setHorarioSelected(minutosAHora(horario))
                        }
                      >
                        {' '}
                        {minutosAHora(horario)}
                      </button>
                    ))}
                  </div>
                )}
                <h2 className="mt-6">Tarde:</h2>

                {horariosTarde.length === 0 ? (
                  <p className="text-red-500 text-xl m-7">
                    No hay horarios disponibles en la tarde para la fecha
                    seleccionada.
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-4 gap-2 mt-5 px-7">
                      {horariosTarde.map((horario) => (
                        <button
                          key={`tarde-${horario}`}
                          className={
                            minutosAHora(horario) === horarioSelected
                              ? 'bg-naranja-1 border-none rounded-md text-white px-6 py-2 hover:bg-neutral-200 border-2 border-naranja-1 hover:text-naranja-1 transition-colors duration-300'
                              : 'bg-neutral-200 rounded-md py-2 hover:bg-neutral-400'
                          }
                          onClick={() =>
                            setHorarioSelected(minutosAHora(horario))
                          }
                        >
                          {' '}
                          {minutosAHora(horario)}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
            {/* Sección de errores de validación para la página 2 */}
            {(validationErrors.dayForTurn ||
              validationErrors.horarioSelected ||
              validationErrors.general) && (
              <div className="mt-4 px-7">
                {validationErrors.dayForTurn && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.dayForTurn}
                  </p>
                )}
                {validationErrors.horarioSelected && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.horarioSelected}
                  </p>
                )}
                {validationErrors.general && (
                  <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {validationErrors.general}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {/* Botones de navegación del modal */}
        <div className="flex gap-5 justify-center mt-4 px-10 w-full items-center">
          <button
            className={
              page === 1
                ? 'bg-neutral-200 border-none rounded-4xl text-black px-6 py-2  flex-1 max-w-32 '
                : 'bg-naranja-1  rounded-4xl text-white px-6 py-2 hover:bg-white border-2 border-naranja-1 hover:text-naranja-1 transition-colors duration-300 flex-1 max-w-32'
            }
            onClick={() => {
              setPage(1);
              setSelectedService('');
            }}
            disabled={page === 1}
          >
            Volver
          </button>
          {page === 1 && (
            <button
              className={
                selectedTask
                  ? 'bg-naranja-1 rounded-4xl text-white px-6 py-2 hover:bg-white border-2 border-naranja-1 hover:text-naranja-1 transition-colors duration-300 flex-1 max-w-32'
                  : 'bg-neutral-300 border-none rounded-4xl text-neutral-500 px-6 py-2 flex-1 max-w-32 cursor-not-allowed'
              }
              onClick={
                selectedTask
                  ? () => {
                      if (validateForm('service')) {
                        setPage(2);
                      }
                    }
                  : undefined
              }
              disabled={!selectedTask}
            >
              Siguiente
            </button>
          )}
          {page === 2 && (
            <button
              onClick={() => {
                const services = prestatario.servicios.find(
                  (s) => s.tarea.nombreTarea === selectedTask
                );
                const precio = services ? services.precio || 100 : 100;
                setMontofinal((precio * 1.05) / 100); // Actualizar monto final con recargo del 5%
                if (validateForm('datetime')) {
                  setConfirmationModalOpen(true);
                }
              }}
              className={
                !horarioSelected || !dayForTurn
                  ? 'bg-neutral-300 border-none rounded-4xl text-neutral-500 px-6 py-2 flex-1 max-w-32 cursor-not-allowed'
                  : 'bg-green-700 rounded-4xl  text-white px-6 py-2 hover:bg-white border-2 border-green-700 hover:text-green-700 transition-colors duration-300 flex-1 max-w-32'
              }
              disabled={!horarioSelected || !dayForTurn}
            >
              Confirmar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewTurnModal;
