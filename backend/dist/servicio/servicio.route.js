import { Router } from 'express';
import { sanitizeServicioInput, findall, findone, add, update, remove, } from './servicio.controler.js';
export const servicioRouter = Router();
servicioRouter.get('/', findall);
servicioRouter.get('/:id', findone);
servicioRouter.post('/', sanitizeServicioInput, add);
servicioRouter.put('/:id', sanitizeServicioInput, update);
servicioRouter.patch('/:id', sanitizeServicioInput, update);
servicioRouter.delete('/:id', remove);
//# sourceMappingURL=servicio.route.js.map