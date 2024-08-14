import { Router } from 'express'
import { sanitizedEstadoInput, findAll, findOne, add, update, remove } from './estado_torneo.controler.js'

export const estado_torneoRouter = Router()

estado_torneoRouter.get('/', findAll)
estado_torneoRouter.get('/:id', findOne)
estado_torneoRouter.post('/', sanitizedEstadoInput, add)
estado_torneoRouter.put('/:id', sanitizedEstadoInput, update)
estado_torneoRouter.patch('/:id', sanitizedEstadoInput, update)
estado_torneoRouter.delete('/:id', remove)