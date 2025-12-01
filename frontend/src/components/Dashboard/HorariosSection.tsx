import { useState, useEffect } from 'react';
import DashboardSection from '../DashboardSection/DashboardSection';
import useAuth from '../../cookie/useAuth';
import { Alert, AlertTitle, AlertDescription } from '../Alerts/Alerts';
import { horariosApi } from '../../services/horariosApi';

interface HorarioDia {
  dia: string;
  horaDesde: string;
  horaHasta: string;
  activo: boolean;
}

function HorariosSection() {
  const { usuario } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'danger'>('success');
  const [alertMessage, setAlertMessage] = useState('');

  // Estado para los horarios de la semana
  const [horarios, setHorarios] = useState<HorarioDia[]>([
    { dia: 'Lunes', horaDesde: '09:00', horaHasta: '17:00', activo: false },
    { dia: 'Martes', horaDesde: '09:00', horaHasta: '17:00', activo: false },
    { dia: 'Miércoles', horaDesde: '09:00', horaHasta: '17:00', activo: false },
    { dia: 'Jueves', horaDesde: '09:00', horaHasta: '17:00', activo: false },
    { dia: 'Viernes', horaDesde: '09:00', horaHasta: '17:00', activo: false },
    { dia: 'Sábado', horaDesde: '09:00', horaHasta: '17:00', activo: false },
    { dia: 'Domingo', horaDesde: '09:00', horaHasta: '17:00', activo: false },
  ]);

  // Helpers para conversión y formato
  const swapCeroDoce = (h: number) => (h === 0 ? 12 : h === 12 ? 0 : h);
  const pad2 = (n: number) => n.toString().padStart(2, '0');

  // Cargar horarios
  useEffect(() => {
    const cargarHorarios = async () => {
      if (!usuario) return;
      try {
        setLoading(true);
        const response = await horariosApi.getByUsuarioId(usuario.id);
        const horariosDb = response.data?.data || [];
        const DIAS_SEMANA = [
          'Lunes',
          'Martes',
          'Miércoles',
          'Jueves',
          'Viernes',
          'Sábado',
          'Domingo',
        ];
        //contstruyo estado inicial a partir de los datos recibidos del backend.
        const nuevosHorarios: HorarioDia[] = DIAS_SEMANA.map((dia, idx) => {
          const db = horariosDb.find((h: any) => h.diaSemana === idx);
          if (db) {
            const activo = !(
              db.horaDesde === '00:00:00' && db.horaHasta === '00:00:00'
            );
            return {
              dia,
              horaDesde: db.horaDesde?.slice(0, 5),
              horaHasta: db.horaHasta?.slice(0, 5),
              activo,
            };
          } else {
            return {
              dia,
              horaDesde: '09:00',
              horaHasta: '15:00',
              activo: false,
            };
          }
        });
        setHorarios(nuevosHorarios);
        setLoading(false);
      } catch (err) {
        console.error('Error cargando horarios:', err);
        setError('Error al cargar los horarios');
        setLoading(false);
      }
    };
    cargarHorarios();
  }, [usuario]);

  // Función para manejar cambios en los horarios
  //valor es string tmb para los checkbox
  const handleHorarioChange = (
    index: number,
    campo: keyof HorarioDia,
    valor: boolean | string
  ) => {
    setHorarios((prev) =>
      prev.map((horario, i) =>
        i === index ? { ...horario, [campo]: valor } : horario
      )
    );
  };

  const validarHorarios = () => {
    for (const horario of horarios) {
      if (horario.activo) {
        let [desdeH, desdeM] = horario.horaDesde.split(':').map(Number);
        let [hastaH, hastaM] = horario.horaHasta.split(':').map(Number);

        // Aplicar conversión 00 ↔ 12 antes del cálculo de minutos
        desdeH = swapCeroDoce(desdeH);
        hastaH = swapCeroDoce(hastaH);

        const minutosDesde = desdeH * 60 + desdeM;
        const minutosHasta = hastaH * 60 + hastaM;

        if (minutosDesde >= minutosHasta) {
          return `Error en ${horario.dia}: La hora desde debe ser anterior a la hora hasta`;
        }
      }
    }
    return null;
  };

  const guardarHorarios = async () => {
    if (!usuario) {
      setAlertType('danger');
      setAlertMessage('Error: Usuario no autenticado');
      setShowAlert(true);
      return;
    }
    const errorValidacion = validarHorarios();
    if (errorValidacion) {
      setAlertType('danger');
      setAlertMessage(errorValidacion);
      setShowAlert(true);
      return;
    }
    setGuardando(true);
    try {
      // crea objeto para el back
      const horariosPayload = horarios.map((h, idx) => {
        let [desdeH, desdeM] = h.horaDesde.split(':').map(Number);
        let [hastaH, hastaM] = h.horaHasta.split(':').map(Number);

        // Aplicar conversión 00 ↔ 12
        desdeH = swapCeroDoce(desdeH);
        hastaH = swapCeroDoce(hastaH);

        return {
          diaSemana: idx,
          horaDesde: h.activo
            ? `${pad2(desdeH)}:${pad2(desdeM)}:00`
            : '00:00:00',
          horaHasta: h.activo
            ? `${pad2(hastaH)}:${pad2(hastaM)}:00`
            : '00:00:00',
          usuario: usuario.id,
        };
      });
      console.log(horariosPayload);
      await horariosApi.updateBatchByUsuarioId(usuario.id, horariosPayload);
      setAlertType('success');
      setAlertMessage('✅ Horarios guardados exitosamente');
      setShowAlert(true);
    } catch (err) {
      setAlertType('danger');
      setAlertMessage('❌ Error al guardar los horarios. Intenta nuevamente.');
      setShowAlert(true);
      console.log(err);
    } finally {
      setGuardando(false);
    }
  };

  // limpiar alerta
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  if (loading) {
    return (
      <DashboardSection>
        <div className="flex items-center justify-center h-48 sm:h-64 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">
              Cargando información de horarios...
            </p>
          </div>
        </div>
      </DashboardSection>
    );
  }

  if (error) {
    return (
      <DashboardSection>
        <div className="py-6 sm:py-8 px-4 flex flex-col items-center">
          <Alert variant="danger" className="mb-4 max-w-md w-full text-center">
            <AlertTitle className="text-left w-full">Error</AlertTitle>
            <AlertDescription className="text-left w-full">
              {error}
            </AlertDescription>
          </Alert>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm sm:text-base"
          >
            Reintentar
          </button>
        </div>
      </DashboardSection>
    );
  }

  return (
    <DashboardSection title="Mis horarios">
      <div className="px-2 sm:px-0">
        {/* Mostrar gestión de horarios siempre */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            {/* Grid de días de la semana */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {horarios.map((horario, index) => (
                <div
                  key={horario.dia}
                  className={`border border-gray-200 rounded-lg p-4 bg-gray-50 transition-all duration-200 cursor-pointer ${
                    horario.activo
                      ? 'ring-2 ring-orange-400 bg-orange-50'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).tagName === 'INPUT') return;
                    handleHorarioChange(index, 'activo', !horario.activo);
                  }}
                >
                  {/* Checkbox y nombre del día */}
                  <div className="flex items-center mb-3">
                    <span className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        id={`dia-${index}`}
                        checked={horario.activo}
                        onChange={(e) =>
                          handleHorarioChange(index, 'activo', e.target.checked)
                        }
                        className="peer h-4 w-4 rounded border border-gray-500 bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500 checked:bg-orange-500 checked:border-orange-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="absolute pointer-events-none inset-0 flex items-center justify-center">
                        {horario.activo && (
                          <svg
                            className="w-4 h-4 block"
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
                    <label
                      htmlFor={`dia-${index}`}
                      className="ml-2 block text-sm font-medium text-gray-900 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {horario.dia}
                    </label>
                  </div>

                  {/* Inputs de horarios */}
                  <div
                    className={`space-y-3 ${
                      !horario.activo ? 'opacity-50' : ''
                    }`}
                  >
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Desde
                      </label>
                      <input
                        type="time"
                        value={horario.horaDesde}
                        onChange={(e) => {
                          handleHorarioChange(
                            index,
                            'horaDesde',
                            e.target.value
                          );
                        }}
                        disabled={!horario.activo}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Hasta
                      </label>
                      <input
                        type="time"
                        value={horario.horaHasta}
                        onChange={(e) =>
                          handleHorarioChange(
                            index,
                            'horaHasta',
                            e.target.value
                          )
                        }
                        disabled={!horario.activo}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen de días activos */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Resumen
              </h4>
              <div className="text-sm text-blue-800">
                {horarios.filter((h) => h.activo).length === 0 ? (
                  <p>No hay días de trabajo configurados</p>
                ) : (
                  <div className="space-y-1">
                    <p>
                      Días de trabajo: {horarios.filter((h) => h.activo).length}{' '}
                      de 7
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {horarios
                        .filter((h) => h.activo)
                        .map((h) => (
                          <span
                            key={h.dia}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                          >
                            {h.dia}: {h.horaDesde} - {h.horaHasta}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Alerta de feedback - arriba del botón */}
            {showAlert && (
              <div className="mb-4">
                <Alert variant={alertType} className="shadow-lg">
                  <AlertDescription>{alertMessage}</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Botón de guardar */}
            <div className="flex justify-center">
              <button
                onClick={guardarHorarios}
                disabled={guardando}
                className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                  guardando
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 hover:cursor-pointer'
                }`}
              >
                {guardando ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </div>
                ) : (
                  'Guardar Horarios'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardSection>
  );
}

export default HorariosSection;
