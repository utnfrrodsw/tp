import { useEffect, useState } from 'react';
import { zonasApi } from '../../services/zonasApi';
import { Alert, AlertDescription } from '../Alerts/Alerts';
import DashboardSection from '../DashboardSection/DashboardSection.tsx';

function ZonasSection() {
  const [zonas, setZonas] = useState<
    { id: number; descripcionZona: string; selected: boolean }[]
  >([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'danger'>('success');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchZonas = async () => {
      try {
        const response = await zonasApi.getAllPerUser();
        setZonas(response.data.data);
      } catch (error) {
        console.error('Error cargando zonas:', error);
      }
    };
    fetchZonas();
  }, []);

  const cambioZona = async (zonaId: number, estado: boolean) => {
    try {
      const res = await zonasApi.updateByUser(zonaId.toString(), estado);
      if (res.data) {
        setZonas((prevZonas) =>
          prevZonas.map((zona) =>
            zona.id === zonaId ? { ...zona, selected: !zona.selected } : zona
          )
        );
      }
      setShowAlert(true);
      setAlertType('success');
      setAlertMessage(estado ? 'Zona eliminada correctamente' : 'Zona agregada correctamente');
    } catch (error) {
      setShowAlert(true);
      setAlertType('danger');
      setAlertMessage('Error al actualizar la zona');
      console.error('Error cambiando zona:', error);
    }
  };

  return (
    <DashboardSection title="Mis zonas">
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {zonas.length > 0 ? (
        <div className="flex items-center justify-between flex-wrap">
          {zonas.map((zona) => (
            <button
              key={zona.id}
              className={`flex items-center gap-3 px-5 py-2 my-2 mr-3 rounded-lg transition-colors duration-150 border ${
                zona.selected
                  ? 'border-naranja-1 bg-naranja-1'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-orange-500'
              }`}
              onClick={() => cambioZona(zona.id, zona.selected)}
            >
              <span
                className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${
                  zona.selected
                    ? 'border-white bg-white'
                    : 'border-naranja-1 bg-transparent'
                }`}
              >
                {zona.selected && (
                  <svg
                    className="w-3 h-3 text-naranja-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </span>
              <span className="font-medium">{zona.descripcionZona}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No hay zonas disponibles.</p>
      )}

      {showAlert && (
        <Alert
          variant={alertType}
          onClose={() => setShowAlert(false)}
          autoClose={true}
          autoCloseDelay={5000}
        >
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  </DashboardSection>
  );
}

export default ZonasSection;
