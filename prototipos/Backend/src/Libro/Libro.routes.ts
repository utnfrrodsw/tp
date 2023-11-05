import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update } from './Libro.controller.js';

export const libroRouter = Router();

libroRouter.get('/Editorial/:id/Libro', findAll);
libroRouter.get('/Editorial/:id/libro/:id', findOne);
libroRouter.post('/Editorial/:id/Libro', sanitizeInput, add);
libroRouter.put('/Editorial/:id/Libro/:id', sanitizeInput, update);
libroRouter.patch('/Editorial/:id/Libro/:id', sanitizeInput, update);
libroRouter.delete('/Editorial/:id/Libro/:id', remove);
