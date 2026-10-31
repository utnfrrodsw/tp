import { getOrm } from '../../../config/orm.js';
import { Evento } from '../../../entities/evento.js';
import type { CreateEventoDto, UpdateEventoDto } from '../dtos/evento.dto.js';

export const listEventos = async (includeDraft = false): Promise<Evento[]> => {
  const em = getOrm().em.fork();

  return em.find(Evento, includeDraft ? {} : { draft: false }, { orderBy: { creadoEn: 'DESC' } });
};

export const getEventoById = async (id: number): Promise<Evento | null> => {
  const em = getOrm().em.fork();

  return em.findOne(Evento, { id });
};

export const createEvento = async (data: CreateEventoDto): Promise<Evento> => {
  const em = getOrm().em.fork();

  const evento = em.create(Evento, {
    nombre: data.nombre,
    descripcion: data.descripcion,
    imagen: data.imagen,
    draft: data.draft ?? true,
    creadoEn: new Date()
  });

  await em.persist(evento).flush();

  return evento;
};

export const updateEvento = async (id: number, data: UpdateEventoDto): Promise<Evento | null> => {
  const em = getOrm().em.fork();

  const evento = await em.findOne(Evento, { id });

  if (!evento) return null;

  if (data.nombre !== undefined) evento.nombre = data.nombre;
  if (data.descripcion !== undefined) evento.descripcion = data.descripcion;
  if (data.imagen !== undefined) evento.imagen = data.imagen;
  if (data.draft !== undefined) evento.draft = data.draft;

  await em.flush();

  return evento;
};

export const deleteEvento = async (id: number): Promise<boolean> => {
  const em = getOrm().em.fork();

  const evento = await em.findOne(Evento, { id });

  if (!evento) return false;

  await em.remove(evento).flush();

  return true;
};
