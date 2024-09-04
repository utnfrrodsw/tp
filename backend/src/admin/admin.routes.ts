import { Router } from "express";
import { sanitizarAdminInput, findAll, findOne, add, update, remove  } from "./admin.controler.js";

export const adminsRouter = Router()

adminsRouter.get('/', findAll)
adminsRouter.get('/:id', findOne)
adminsRouter.post('/', sanitizarAdminInput, add)
adminsRouter.put('/:id', sanitizarAdminInput, update)
adminsRouter.patch('/:id', sanitizarAdminInput, update)
adminsRouter.delete('/:id', remove)