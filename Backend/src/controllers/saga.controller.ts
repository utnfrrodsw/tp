// src/controllers/saga.controller.ts
import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Saga } from '../entities/saga.entity';
import { AuthRequest } from '../middleware/auth.middleware';
import { Libro } from '../entities/libro.entity';
import { getBookById } from '../services/googleBooks.service';
import { Autor } from '../entities/autor.entity';
import { transformarLibros, validateSagaData } from '../utils/sagaHelpers';


export const getSagas = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const em = orm.em.fork();
  const sagas = await orm.em.find(Saga, {}, { populate: ['libros.autor'] });

  const sagasWithCount = await Promise.all(sagas.map(async saga => {
    const librosTransformados = await transformarLibros(em, saga.libros.getItems());

    return {
      ...saga,
      libros: librosTransformados,
      cantidadLibros: saga.libros.length
    };
  }));
  
  res.json(sagasWithCount);
};

export const getSagaById = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const em = orm.em.fork();
  const saga = await orm.em.findOne(Saga, { id: +req.params.id }, { populate: ['libros.autor'] });
  
  if (!saga) return res.status(404).json({ error: 'No encontrada' });

  const librosTransformados = await transformarLibros(em, saga.libros.getItems());

  res.json({
    ...saga,
    libros: librosTransformados,
  });
};

export const createSaga = async (req: AuthRequest, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const { nombre, libroIds } = req.body;

  try {
    // 1️⃣ Validar datos de entrada
    const validation = validateSagaData(nombre, libroIds);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // 2️⃣ Verificar que todos los libros existan
    const libros = await orm.em.find(Libro, { id: { $in: libroIds } });
    if (libros.length !== libroIds.length) {
      return res.status(400).json({ error: 'Uno o más libros no existen' });
    }

    // 3️⃣ Crear saga y asociar libros en transacción
    await orm.em.transactional(async (em) => {
      const saga = em.create(Saga, { nombre: nombre.trim(), createdAt: new Date() });
      saga.libros.set(libros);
      await em.persistAndFlush(saga);
    });

    // 4️⃣ Obtener saga creada con libros poblados
    const createdSaga = await orm.em.findOne(Saga, { nombre: nombre.trim() }, { populate: ['libros.autor'] });
    res.status(201).json(createdSaga);
  } catch (error) {
    console.error('Error creating saga:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateSaga = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const saga = await orm.em.findOne(Saga, { id: +req.params.id });
  if (!saga) return res.status(404).json({ error: 'No encontrada' });
  orm.em.assign(saga, req.body);
  await orm.em.flush();
  res.json(saga);
};

export const deleteSaga = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const saga = await orm.em.findOne(Saga, { id: +req.params.id });
  if (!saga) return res.status(404).json({ error: 'No encontrada' });
  await orm.em.removeAndFlush(saga);
  res.json({ mensaje: 'Eliminada' });
};
