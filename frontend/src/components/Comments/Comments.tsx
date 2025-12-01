import Stars from '../stars/Stars';
import { useState, useEffect } from 'react';
import { turnosApi } from '../../services/turnosApi';
import { serviciosApi } from '../../services/serviciosApi';
export type Props = {
  id: number;
};

export type Turno = {
  usuario?: {
    nombre: string;
    foto: string;
  };
  servicio: {
    id: number;
    usuario: number;
  };
  comentario?: string;
  calificacion?: number;
};
type Servicio = {
  id: number;
  precio: number;
  usuario: {
    id: number;
    nombre: string;
    nombreFantasia: string;
  };
  tarea?: {
    id: number;
    nombreTarea: string;
    descripcionTarea?: string;
    duracionTarea?: number;
    tipoServicio?: number;
  };
};

function Comments({ id }: Props) {
  const [turno, setTurno] = useState<Turno | null>(null);
  const [servicio, setServicio] = useState<Servicio | null>(null);

  useEffect(() => {
    const getTurno = async (id: number) => {
      try {
        const res = await turnosApi.getById(String(id));
        setTurno(res.data.data);
      } catch (error) {
        console.error('Error al cargar turno:', error);
      }
    };
    getTurno(id);
  }, [id]);

  const idService = turno?.servicio?.id;

  useEffect(() => {
    const getServicio = async (id: number) => {
      try {
        const res = await serviciosApi.getById(id.toString());
        setServicio(res.data.data);
      } catch (error) {
        console.error('Error al cargar servicio:', error);
      }
    };
    if (idService !== undefined) {
      getServicio(idService);
    }
  }, [idService]);

  const fotoUser = turno?.usuario?.foto;
  const nombreUser = turno?.usuario?.nombre || 'Nombre Usuario';
  const comentarioText = turno?.comentario || 'La persona no dejó comentario.';
  const calificacion = turno?.calificacion || 3;

  const nombreTarea = servicio?.tarea?.nombreTarea || 'Tarea no especificada';

  const nombrePrestatario =
    servicio?.usuario?.nombreFantasia || 'Nombre Prestatario';
  return (
    <div className="mx-auto mt-6 rounded-xl bg-white shadow-[0_0_30px_0_rgba(0,0,0,0.1)] p-3 h-auto pb-0 w-full">
      <div className="flex items-center w-full mb-4">
        <div className="flex flex-row items-center flex-1">
          <img
            className="w-12 h-12 rounded-full mr-3"
            src={fotoUser}
            alt="foto de perfil de usuario"
          />
          <div className="flex flex-col space-y-0">
            <h2 className="text-black text-left leading-tight">{nombreUser}</h2>
            <p className="text-gray-500 text-xs text-left leading-tight">
              {nombreTarea}
            </p>
          </div>
        </div>
        <div className="inline-flex items-center p-0 m-0">
          <div style={{ margin: 0, padding: 0 }}>
            <Stars cant={calificacion} className="!mx-0 !ml-0 !mr-0" />
          </div>
        </div>
      </div>

      <p className="text-black text-left text-sm">{comentarioText}</p>
      <div className="w-full flex flex-row m-2/100">
        <p className="mt-3 pb-2 text-gray-500 text-xs">
          {' '}
          Reseña a {nombrePrestatario}
        </p>
      </div>
    </div>
  );
}

export default Comments;
