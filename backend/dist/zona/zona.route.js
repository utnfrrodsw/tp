import { Router } from 'express';
import { findAll, findOne, add, update, remove, sanitizeZonaInput, } from './zona.controller.js';
export const zonaRouter = Router();
zonaRouter.get('/', sanitizeZonaInput, findAll);
zonaRouter.get('/:id', sanitizeZonaInput, findOne);
zonaRouter.post('/', sanitizeZonaInput, add);
zonaRouter.put('/:id', sanitizeZonaInput, update);
zonaRouter.patch('/:id', sanitizeZonaInput, update);
zonaRouter.delete('/:id', sanitizeZonaInput, remove);
//# sourceMappingURL=zona.route.js.map