import { Router } from "express";
import { sanitizarAdminInput, findAll, findOne, registroAdmin, update, remove } from "./admin.controler.js";
export const adminsRouter = Router();
adminsRouter.get('/', findAll);
adminsRouter.get('/:id', findOne);
adminsRouter.post('/registro', sanitizarAdminInput, registroAdmin);
adminsRouter.put('/:id', sanitizarAdminInput, update);
adminsRouter.patch('/:id', sanitizarAdminInput, update);
adminsRouter.delete('/:id', remove);
//# sourceMappingURL=admin.routes.js.map