import { Router } from 'express';
import { sanitizeSocioInput, findAll,findOne, add, update, remove } from './socio.controller.js';

export const socioRouter = Router();

socioRouter.get('/', findAll);
socioRouter.get('/:id', findOne);
socioRouter.post('/', sanitizeSocioInput, add);
socioRouter.put('/:id', sanitizeSocioInput, update);
socioRouter.patch('/:id', sanitizeSocioInput, update);
socioRouter.delete('/:id', remove);