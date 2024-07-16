import { Router } from "express";
import { sanitizedEventoInput, findAll, findOne, add, update, remove } from "./controlador";

export const eventoRouter = Router()

eventoRouter.get('/', findAll)
eventoRouter.get('/:id', findOne)
eventoRouter.post('/', sanitizedEventoInput, add)
eventoRouter.put('/:id', sanitizedEventoInput, update)
eventoRouter.patch('/:id', sanitizedEventoInput, update)
eventoRouter.delete('/:id', remove)