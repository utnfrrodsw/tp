import { Router } from 'express';
import {
  sanitizeHorarioInput,
  findAll,
  findManyByUser,
  add,
  update,
  remove,
} from './horario.controler.js';

export const horarioRouter = Router();

horarioRouter.get('/', findAll);
horarioRouter.get('/:usuario', findManyByUser);
horarioRouter.post('/', sanitizeHorarioInput, add);
horarioRouter.put('/:id', sanitizeHorarioInput, update);
horarioRouter.patch('/:id', sanitizeHorarioInput, update);
horarioRouter.delete('/:id', remove);
