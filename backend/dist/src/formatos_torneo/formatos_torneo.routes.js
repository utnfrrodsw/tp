import { Router } from "express";
import { sanitizeFormatoInput, findAll, findOne, add, update, remove } from "./formatos_torneo.controler.js";
export const formatoRouter = Router();
formatoRouter.get('/', findAll);
formatoRouter.get('/:id', findOne);
formatoRouter.post('/', sanitizeFormatoInput, add);
formatoRouter.put('/:id', sanitizeFormatoInput, update);
formatoRouter.delete('/:id', remove);
//# sourceMappingURL=formatos_torneo.routes.js.map