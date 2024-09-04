import { Router } from "express";
import { sanitizarPartidoInput, findAll, findOne, add, update, remove } from "./partido.controler.js";
export const partidosRouter = Router();
partidosRouter.get('/', findAll);
partidosRouter.get('/:id', findOne);
partidosRouter.post('/', sanitizarPartidoInput, add);
partidosRouter.put('/:id', sanitizarPartidoInput, update);
partidosRouter.patch('/:id', sanitizarPartidoInput, update);
partidosRouter.delete('/:id', remove);
//# sourceMappingURL=partido.routes.js.map