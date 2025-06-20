import { Router } from 'express';
import {
  sanitizeServiceTypeInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './tipoServ.controler.js';

export const serviceTypeRouter = Router();

serviceTypeRouter.get('/', findAll);
serviceTypeRouter.get('/:id', findOne);
serviceTypeRouter.post('/', sanitizeServiceTypeInput, add);
serviceTypeRouter.put('/:id', sanitizeServiceTypeInput, update);
serviceTypeRouter.patch('/:id', sanitizeServiceTypeInput, update);
serviceTypeRouter.delete('/:id', remove);
