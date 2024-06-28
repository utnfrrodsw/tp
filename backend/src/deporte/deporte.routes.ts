import { Router } from 'express'
import { sanitizeDeporteInput, findAll, findOne, add, update, remove } from './deporte.controler.js'

export const deporteRouter = Router()

deporteRouter.get('/', findAll)
deporteRouter.get('/:id', findOne)
deporteRouter.post('/', sanitizeDeporteInput, add)
deporteRouter.put('/:id', sanitizeDeporteInput, update)
deporteRouter.patch('/:id', sanitizeDeporteInput, update)
deporteRouter.delete('/:id', remove)