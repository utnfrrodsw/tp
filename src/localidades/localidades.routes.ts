import { Router } from "express";
import { sanitizarLocalidadInput, findAll, findOne, add, update, remove } from "./localidades.controler.js";

export const localidadesRouter = Router()

localidadesRouter.get('/', findAll)
localidadesRouter.get('/:id', findOne)
localidadesRouter.post('/', sanitizarLocalidadInput, add)
localidadesRouter.put('/:id', sanitizarLocalidadInput, update)
localidadesRouter.patch('/:id', sanitizarLocalidadInput, update)
localidadesRouter.delete('/:id', remove)