// src/controllers/ratingLibro.controller.ts
import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/core';
import { RatingLibro } from '../entities/ratingLibro.entity';
import { Libro } from '../entities/libro.entity';

export const getRatingLibros = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const ratings = await orm.em.find(RatingLibro, {}, { populate: ['libro'] });
  res.json(ratings);
};

export const getRatingLibroById = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const rating = await orm.em.findOne(RatingLibro, { id: +req.params.id }, { populate: ['libro'] });
  if (!rating) return res.status(404).json({ error: 'Rating no encontrado' });
  res.json(rating);
};

export const getRatingLibroByLibroId = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const externalId = req.params.libroId;

  const libro = await orm.em.findOne(Libro, { externalId });
  if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });

  const rating = await orm.em.findOne(RatingLibro, { libro: libro.id });
  
  // If no rating exists, return default values instead of 404
  if (!rating) {
    return res.json({
      id: null,
      avgRating: 0,
      cantidadResenas: 0,
      libro: libro.id,
      fechaCreacion: null,
      fechaActualizacion: null
    });
  }

  res.json(rating);
};

export const createOrUpdateRatingLibro = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const { libroId, avgRating, cantidadResenas } = req.body;

  if (!libroId || avgRating === undefined || cantidadResenas === undefined) {
    return res.status(400).json({ error: 'Libro ID, promedio de rating y cantidad de reseñas son requeridos' });
  }


  let libro;
  if (typeof libroId === 'number') {
    libro = await orm.em.findOne(Libro, { id: libroId });
  } else {
    libro = await orm.em.findOne(Libro, { externalId: String(libroId) });
  }
  
  if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });

  let rating = await orm.em.findOne(RatingLibro, { libro: libro.id });

  if (rating) {
    // Update existing rating
    rating.avgRating = avgRating;
    rating.cantidadResenas = cantidadResenas;
    rating.fechaActualizacion = new Date();
  } else {

    rating = orm.em.create(RatingLibro, {
      libro,
      avgRating,
      cantidadResenas,
      fechaActualizacion: new Date()
    });
    await orm.em.persist(rating);
  }

  await orm.em.flush();
  res.status(201).json(rating);
};

export const deleteRatingLibro = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const rating = await orm.em.findOne(RatingLibro, { id: +req.params.id });
  if (!rating) return res.status(404).json({ error: 'Rating no encontrado' });

  await orm.em.removeAndFlush(rating);
  res.json({ mensaje: 'Rating eliminado' });
};

export const deleteRatingLibroByLibroId = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const libroIdParam = req.params.libroId;
  
 
  let libro;
  if (!isNaN(Number(libroIdParam))) {
    libro = await orm.em.findOne(Libro, { id: +libroIdParam });
  } else {
    libro = await orm.em.findOne(Libro, { externalId: libroIdParam });
  }
  
  if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
  
  const rating = await orm.em.findOne(RatingLibro, { libro: libro.id });
  if (!rating) return res.status(404).json({ error: 'Rating no encontrado para este libro' });

  await orm.em.removeAndFlush(rating);
  res.json({ mensaje: 'Rating eliminado' });
};
