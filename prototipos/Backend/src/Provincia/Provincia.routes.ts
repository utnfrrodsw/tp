import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update, getProvincias, getProvinciaByDescripcion } from './Provincia.controller.js';

export const provinciaRouter = Router();

// Otras rutas

provinciaRouter.get('/provincias', getProvincias);
provinciaRouter.get('/get-descripcion/:descripcion', getProvinciaByDescripcion)

provinciaRouter.get('/', findAll);
provinciaRouter.get('/:id', findOne);
provinciaRouter.post('/', sanitizeInput, add);
provinciaRouter.put('/:id', sanitizeInput, update);
provinciaRouter.delete('/:id', remove);

export default provinciaRouter;