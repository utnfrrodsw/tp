import { Router } from "express";
import { sanitizarSucursalInput, findAll, findOne, add, update, remove } from "./sucursal.controler.js";

export const sucursalesRouter = Router()

sucursalesRouter.get('/', findAll)
sucursalesRouter.get('/:id', findOne)
sucursalesRouter.post('/', sanitizarSucursalInput, add)
sucursalesRouter.put('/:id', sanitizarSucursalInput, update)
sucursalesRouter.patch('/:id', sanitizarSucursalInput, update)
sucursalesRouter.delete('/:id', remove)