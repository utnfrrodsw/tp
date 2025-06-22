import { Router } from 'express';
import {
  sanitizeTareaInput,
  findall,
  findone,
  add,
  update,
  remove,
} from './tarea.controler.js';

export const tareaRouter = Router();
tareaRouter.get('/', findall);
tareaRouter.get('/:id', findone);
tareaRouter.post('/', sanitizeTareaInput, add);
tareaRouter.put('/:id', sanitizeTareaInput, update);
tareaRouter.patch('/:id', sanitizeTareaInput, update);
tareaRouter.delete('/:id', remove);
