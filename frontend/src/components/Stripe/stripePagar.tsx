import { useState } from 'react';
import { stripeApi } from '../../services/stripeApi';
type Props = {
  amount: number; // en centavos
  sellerStripeId: string;
  userID: number;
  userMail: string;
  turno: Turno;
};

type Turno = {
  id: number;
  fechaHora: Date;
  montoFinal: number;
  servicio: Servicio;
  calificacion: number | null;
  comentario: string | null;
  estado: string;
  usuario: Usuario;
  pagos: Pago[];
  hayPagoAprobado?: boolean; // Nuevo campo para indicar si tiene pagos aprobados
};

type Pago = {
  id: number;
  estado: string;
};
type Servicio = {
  id: number;
  tarea: Tarea;
  usuario: Usuario;
};
type Tarea = {
  nombreTarea: string;
  descripcionTarea: string;
  duracionTarea: number;
  tipoServicio: {
    id: number;
    nombreTipo: string;
  };
};
type Usuario = {
  id: number;
  mail: string;
  nombreFantasia: string;
  stripeAccountId?: string;
};

function PagarTurno({
  amount,
  sellerStripeId,
  userID,
  userMail,
  turno,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState('');
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    // Datos que enviamos al backend - corregir el nombre del campo
    const paymentData = {
      amount: amount, // monto en centavos
      sellerStripeId: sellerStripeId, // ID de cuenta conectada del vendedor
      turno: turno.id, // ID del turno que se está pagando
      userMail: userMail,
      userID: userID,
    };

    console.log('Enviando datos de pago:', paymentData);

    try {
      // Llamada a tu backend para crear la Checkout Session
      const res = await stripeApi.pay(paymentData);

      if (!res.data.url) {
        console.error('Error creando Checkout Session', res.data);
        setError('No se pudo crear la sesión de pago');
        setLoading(false);
        return;
      }

      // Redirige al usuario a Stripe Checkout
      window.location.href = res.data.url;
    } catch (err) {
      console.error('Error al crear la sesión de pago:', err);
      setError('Error al procesar el pago. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {preferenceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-5 backdrop-blur-xs bg-opacity-40">
          <div className="bg-white md:rounded-lg md:shadow-2xl md:p-10 text-black md:w-135 md:h-auto w-full px-10 h-full p-15 flex flex-col">
            <h2 className="text-lg">Pago del servicio</h2>
            <button
              onClick={() => {
                setPreferenceId('');
                setError('');
              }}
              className="-mt-9 ml-auto hover:bg-gray-100 rounded-full transition-colors duration-200 p-2"
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
            <div className="items-start text-start">
              <p>Tipo: {turno.servicio.tarea.tipoServicio.nombreTipo}</p>
              <p>Tarea: {turno.servicio.tarea.nombreTarea}</p>
              <p>Descripción: {turno.servicio.tarea.descripcionTarea}</p>
              <p>Duración: {turno.servicio.tarea.duracionTarea} minutos</p>
              <p>
                Dia-Hora:{' '}
                {new Date(turno.fechaHora).toLocaleString('es-AR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="pb-10">Monto final: ${turno.montoFinal / 100}</p>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Pagar a Turno'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full">
        <button
          className="bg-naranja-1 text-white hover:text-naranja-1 hover:bg-white w-full rounded-2xl border-2 border-naranja-1 disabled:opacity-50"
          onClick={() => setPreferenceId('open')}
          disabled={loading}
        >
          {loading ? 'Creando pago...' : 'Realizar Pago'}
        </button>

        {/* ✅ Mostrar errores */}
        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="text-sm">Error: {error}</p>
            <button
              onClick={() => setError('')}
              className="text-xs underline hover:no-underline"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default PagarTurno;
