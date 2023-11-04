import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update } from './Libro.controler.js';

export const editorialRouter = Router();

editorialRouter.get('/Editorial/:id/Libro', findAll)
editorialRouter.get('/Editorial/:id/libro/:id', findOne)
editorialRouter.post('/Editorial/:id/Libro', sanitizeInput, add)
editorialRouter.put('/Editorial/:id/Libro/:id', sanitizeInput, update)
editorialRouter.patch('/Editorial/:id/Libro/:id',sanitizeInput, update)
editorialRouter.delete('/Editorial/:id/Libro/:id', remove)
