import { getOrm } from '../../../config/orm.js';
import { User } from '../../../entities/usuario.js';
import { Evento } from '../../../entities/evento.js';
import { Servicio } from '../../../entities/servicio.js';
import { TableroServicio } from '../../../entities/tablero-servicio.js';

export interface AdminStats {
  empresasActivas: number;
  eventosPublicados: number;
  eventosBorrador: number;
  clientesRegistrados: number;
}

export interface BusinessStats {
  serviciosActivos: number;
  serviciosBorrador: number;
  serviciosEnRevision: number;
  vecesGuardadoEnTableros: number;
  categoriasPresentes: number;
}

export const getAdminStats = async (): Promise<AdminStats> => {
  const em = getOrm().em.fork();

  const empresasActivas = await em.count(User, { rol: 'empresa', activo: true });
  const eventosPublicados = await em.count(Evento, { draft: false });
  const eventosBorrador = await em.count(Evento, { draft: true });
  const clientesRegistrados = await em.count(User, { rol: 'cliente' });

  return { empresasActivas, eventosPublicados, eventosBorrador, clientesRegistrados };
};

export const getBusinessStats = async (usuarioId: number): Promise<BusinessStats> => {
  const em = getOrm().em.fork();

  const serviciosActivos = await em.count(Servicio, { usuario: usuarioId, estado: 'publicado' });
  const serviciosBorrador = await em.count(Servicio, { usuario: usuarioId, estado: 'borrador' });
  const serviciosEnRevision = await em.count(Servicio, { usuario: usuarioId, estado: 'revision' });
  const vecesGuardadoEnTableros = await em.count(TableroServicio, { servicio: { usuario: usuarioId } });
  const serviciosDelUsuario = await em.find(Servicio, { usuario: usuarioId }, { populate: ['categoria'] });

  const idsDeCategoriasVistas: number[] = [];
  for (const servicio of serviciosDelUsuario) {
    if (!idsDeCategoriasVistas.includes(servicio.categoria.id)) {
      idsDeCategoriasVistas.push(servicio.categoria.id);
    }
  }
  const categoriasPresentes = idsDeCategoriasVistas.length;

  return { serviciosActivos, serviciosBorrador, serviciosEnRevision, vecesGuardadoEnTableros, categoriasPresentes };
};
