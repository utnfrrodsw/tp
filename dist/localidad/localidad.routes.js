import { Router } from "express";
import { sanitizeLocalidadInput, findAll, findOne, add, update, remove } from "./localidad.controler.js";
export const Localidadrouter = Router();
Localidadrouter.get('/', findAll);
Localidadrouter.get('/:id', findOne);
Localidadrouter.post('/', sanitizeLocalidadInput, add);
Localidadrouter.put('/:id', sanitizeLocalidadInput, update);
Localidadrouter.patch('/:id', sanitizeLocalidadInput, update);
Localidadrouter.delete('/:id', remove);
//# sourceMappingURL=localidad.routes.js.map