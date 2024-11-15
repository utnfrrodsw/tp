import { Router } from "express";
import { sanitizarAdminInput, findAll, findOne, registroAdmin, loginAdmin, update, remove  } from "./admin.controler.js";

export const adminsRouter = Router()

adminsRouter.get('/', findAll)
adminsRouter.get('/:id', findOne)
adminsRouter.post('/registro', sanitizarAdminInput, registroAdmin)
adminsRouter.post('/login',sanitizarAdminInput, loginAdmin)
adminsRouter.put('/:id', sanitizarAdminInput, update)
adminsRouter.patch('/:id', sanitizarAdminInput, update)
adminsRouter.delete('/:id', remove)