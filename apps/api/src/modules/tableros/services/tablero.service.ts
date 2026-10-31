import { getOrm } from '../../../config/orm.js';
import { Tablero } from '../../../entities/tablero.js';
import { TableroServicio } from '../../../entities/tablero-servicio.js';
import { Evento } from '../../../entities/evento.js';
import { Servicio } from '../../../entities/servicio.js';
import { User } from '../../../entities/usuario.js';
import type { CreateTableroDto, UpdateTableroDto } from '../dtos/tablero.dto.js';

export const serializeTablero = (tablero: Tablero, servicios: TableroServicio[] = []) => ({
  id: tablero.id,
  nombre: tablero.nombre,
  evento: tablero.evento ? { id: tablero.evento.id, nombre: tablero.evento.nombre } : null,
  fechaCreacion: tablero.fechaCreacion,
  servicios: servicios.map(({ servicio }) => ({
    id: servicio.id,
    nombre: servicio.nombre,
    descripcion: servicio.descripcion,
    imagen: servicio.imagen,
    categoria: { id: servicio.categoria.id, nombre: servicio.categoria.nombre }
  }))
});

export const listTableros = async (clienteId: number) => {
  const em = getOrm().em.fork();

  const tableros = await em.find(Tablero, { cliente: clienteId }, { populate: ['evento'], orderBy: { fechaCreacion: 'DESC' } });
  const guardados = await em.find(TableroServicio, { tablero: { cliente: clienteId } }, { populate: ['servicio.categoria'] });

  return tableros.map((tablero) => ({ tablero, guardados: guardados.filter((item) => item.tablero.id === tablero.id) }));
};

export const getTableroById = async (id: number, clienteId: number) => {
  const em = getOrm().em.fork();

  const tablero = await em.findOne(Tablero, { id, cliente: clienteId }, { populate: ['evento'] });
  if (!tablero) return null;

  const guardados = await em.find(TableroServicio, { tablero: tablero.id }, { populate: ['servicio.categoria'] });

  return { tablero, guardados };
};

export const createTablero = async (clienteId: number, data: CreateTableroDto) => {
  const em = getOrm().em.fork();

  const cliente = await em.findOne(User, { id: clienteId, rol: 'cliente', activo: true });
  const evento = await em.findOne(Evento, { id: data.eventoId, draft: false });
  if (!cliente || !evento) return null;

  const tablero = em.create(Tablero, { nombre: data.nombre.trim(), cliente, evento, fechaCreacion: new Date() });
  await em.persist(tablero).flush();

  return tablero;
};

export const updateTablero = async (id: number, clienteId: number, data: UpdateTableroDto) => {
  const em = getOrm().em.fork();

  const tablero = await em.findOne(Tablero, { id, cliente: clienteId }, { populate: ['evento'] });
  if (!tablero) return 'TABLERO_NOT_FOUND' as const;

  const evento = await em.findOne(Evento, { id: data.eventoId, draft: false });
  if (!evento) return 'EVENTO_NOT_FOUND' as const;

  tablero.nombre = data.nombre.trim();
  tablero.evento = evento;
  await em.flush();

  const guardados = await em.find(TableroServicio, { tablero: tablero.id }, { populate: ['servicio.categoria'] });

  return { tablero, guardados };
};

export const deleteTablero = async (id: number, clienteId: number): Promise<boolean> => {
  const em = getOrm().em.fork();

  const tablero = await em.findOne(Tablero, { id, cliente: clienteId });
  if (!tablero) return false;

  await em.remove(tablero).flush();

  return true;
};

export const addServicioToTablero = async (tableroId: number, clienteId: number, servicioId: number) => {
  const em = getOrm().em.fork();

  const tablero = await em.findOne(Tablero, { id: tableroId, cliente: clienteId });
  if (!tablero) return 'TABLERO_NOT_FOUND' as const;

  const servicio = await em.findOne(Servicio, { id: servicioId, estado: 'publicado' });
  if (!servicio) return 'SERVICIO_NOT_FOUND' as const;

  const existing = await em.findOne(TableroServicio, { tablero: tablero.id, servicio: servicio.id });
  if (existing) return 'ALREADY_SAVED' as const;

  await em.persist(em.create(TableroServicio, { tablero, servicio, guardadoEn: new Date() })).flush();

  return 'OK' as const;
};

export const removeServicioFromTablero = async (tableroId: number, clienteId: number, servicioId: number): Promise<boolean> => {
  const em = getOrm().em.fork();

  const guardado = await em.findOne(TableroServicio, {
    tablero: { id: tableroId, cliente: clienteId },
    servicio: servicioId
  });
  if (!guardado) return false;

  await em.remove(guardado).flush();

  return true;
};
