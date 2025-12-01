import StarRating from '../stars/RatingStars';
import { Alert, AlertTitle, AlertDescription } from '../Alerts/Alerts.tsx';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';

// Esquema de validación con Zod
const calificationSchema = z.object({
  rating: z
    .number()
    .min(1, 'Debe seleccionar al menos 1 estrella')
    .max(5, 'La calificación máxima es 5 estrellas'),
  comentario: z
    .string()
    .min(20, 'El comentario debe tener al menos 20 caracteres')
    .max(500, 'El comentario no puede exceder los 500 caracteres')
    .trim(),
});

type CalificationFormData = z.infer<typeof calificationSchema>;

type Turno = {
  id: number;
  fechaHora: Date;
  montoFinal: number;
  servicio: servicio;
  calificacion: number | null;
  comentario: string | null;
  estado: string;
  usuario: Usuario;
};

type servicio = {
  id: number;
  tarea: Tarea;
  usuario: Usuario;
};
type Tarea = {
  nombreTarea: string;
  descripcionTarea: string;
  duracionTarea: number;
};
type Usuario = {
  id: number;
  mail: string;
  nombreFantasia: string;
};
type Props = {
  data: Turno;
  closeModal: () => void;
  SaveRating: (
    rating: number,
    comentario: string,
    setSpinner: (value: boolean) => void
  ) => void;
  setFlagged: (value: boolean) => void;
  flagged: boolean;
};

function CalificationModal({
  data,
  closeModal,
  SaveRating,
  setFlagged,
  flagged,
}: Props) {
  // alertas de errores del back
  const [spinner, setSpinner] = useState(false);
  useEffect(() => {
    if (flagged) {
      setSpinner(false);
    }
  }, [flagged]);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<CalificationFormData>({
    resolver: zodResolver(calificationSchema),
    defaultValues: {
      rating: 0,
      comentario: ' ',
    },
    mode: 'onChange',
  });

  const onSubmit = (formData: CalificationFormData) => {
    SaveRating(formData.rating, formData.comentario, setSpinner);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-5 backdrop-blur-xs flex-col bg-opacity-40">
      <div className="bg-white md:rounded-lg md:shadow-2xl md:p-10 text-black lg:w-6/12 md:w-9/12  lg:min-h-6/12 md:h-auto w-full px-10 h-full p-15">
        <h1 className="text-2xl font-bold mb-4">Detalles del Turno</h1>
        <div className="flex flex-col gap-2 pb-3 items-start text-left md:pl-25">
          <p>
            Turno ID: <strong>{data.id}</strong>
          </p>
          <p>
            Prestatario:{' '}
            <strong>
              {data.servicio.usuario.nombreFantasia || 'Sin nombre'}
            </strong>
          </p>
          <p>
            Fecha y Hora:{' '}
            {new Date(data.fechaHora).toLocaleDateString('es-AR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}{' '}
            a las{' '}
            {new Date(data.fechaHora).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
          </p>
        </div>
        <form
          id="calification-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex w-full items-center gap-6">
            <span className="whitespace-nowrap">Calificación:</span>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <StarRating
                  initialRating={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.rating && (
              <span className="text-red-500 text-sm ml-2">
                {errors.rating.message}
              </span>
            )}
          </div>
          <div className="md:flex w-full items-center justify-between">
            <label
              htmlFor="comentario"
              className="whitespace-nowrap md:block hidden"
            >
              Comentario:
            </label>
            <div className="flex flex-col w-full">
              <Controller
                name="comentario"
                control={control}
                render={({ field }) => (
                  <textarea
                    className={
                      'border border-naranja-1 rounded-md mx-2 p-2 w-full' +
                      (flagged || errors.comentario
                        ? ' border-red-500 text-red-800'
                        : '')
                    }
                    id="comentario"
                    rows={4}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Escribe tu comentario aquí (mínimo 20 caracteres, máximo 500)..."
                  />
                )}
              />
              {errors.comentario && (
                <span className="text-red-500 text-sm mx-2 mt-1">
                  {errors.comentario.message}
                </span>
              )}
              <div className="text-right mx-2 mt-1">
                <span
                  className={`text-sm ${
                    watch('comentario')?.length > 500
                      ? 'text-red-500'
                      : 'text-gray-500'
                  }`}
                >
                  {watch('comentario')?.length || 0}/500
                </span>
              </div>
            </div>
          </div>
        </form>
        {spinner && (
          <div className="flex justify-center mt-4">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
            <span className="ml-2">Procesando...Por favor espere</span>
          </div>
        )}
        <div className="flex gap-4 mt-4 justify-center">
          <button
            type="button"
            className="px-4 py-2 hover:text-neutral-400 rounded-sm border-1 border-neutral-400 bg-neutral-400 hover:bg-white text-white"
            onClick={closeModal}
          >
            Cerrar
          </button>
          <button
            type="submit"
            form="calification-form"
            className="px-4 py-2 hover:text-amber-700 rounded-sm border-1 border-naranja-1 bg-naranja-1 hover:bg-white text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isValid}
            onClick={() => {
              setSpinner(true);
            }}
          >
            Guardar
          </button>
        </div>
      </div>
      {flagged && (
        <Alert
          variant="danger"
          className="max-w-xl mx-auto mb-4"
          onClose={() => setFlagged(false)}
          autoClose={true}
          autoCloseDelay={10000}
        >
          <AlertTitle>¡Atencion!</AlertTitle>
          <AlertDescription className="mx-auto">
            Su comentario ha sido bloqueado por contener palabras inapropiadas.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
export default CalificationModal;
