import { Router } from "express";
import { sanitizarEquipoInput, findAll, findOne, add, update, remove } from "./equipo.controler.js";
export const equiposRouter = Router();
equiposRouter.get('/', findAll);
equiposRouter.get('/:id', findOne);
equiposRouter.post('/', sanitizarEquipoInput, add);
equiposRouter.put('/:id', sanitizarEquipoInput, update);
equiposRouter.patch('/:id', sanitizarEquipoInput, update);
equiposRouter.delete('/:id', remove);
//# sourceMappingURL=equipo.routes.js.map