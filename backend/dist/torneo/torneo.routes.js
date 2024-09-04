import { Router } from "express";
import { sanitizarTorneoInput, findAll, findOne, add, update, remove } from "./torneo.controler.js";
export const torneosRouter = Router();
torneosRouter.get('/', findAll);
torneosRouter.get('/:id', findOne);
torneosRouter.post('/', sanitizarTorneoInput, add);
torneosRouter.put('/:id', sanitizarTorneoInput, update);
torneosRouter.patch('/:id', sanitizarTorneoInput, update);
torneosRouter.delete('/:id', remove);
//# sourceMappingURL=torneo.routes.js.map