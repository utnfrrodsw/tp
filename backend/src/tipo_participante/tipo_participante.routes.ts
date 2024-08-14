import { Router } from 'express'
import { sanitizeTipo_participanteInput, findAll, findOne, add, update, remove } from './tipo_participante.controler.js'

export const tipo_participanteRouter = Router()

tipo_participanteRouter.get('/', findAll)
tipo_participanteRouter.get('/:id', findOne)
tipo_participanteRouter.post('/', sanitizeTipo_participanteInput, add)
tipo_participanteRouter.put('/:id', sanitizeTipo_participanteInput, update)
tipo_participanteRouter.patch('/:id', sanitizeTipo_participanteInput, update)
tipo_participanteRouter.delete('/:id', remove)