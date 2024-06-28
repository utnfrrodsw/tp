import { Router } from 'express'
import { sanitizeHorarioInput, findAll, findOne, add, update, remove } from './horario.controler.js'

export const horarioRouter = Router()

horarioRouter.get('/', findAll)
horarioRouter.get('/:id', findOne)
horarioRouter.post('/:id', sanitizeHorarioInput, add)
horarioRouter.put('/:id', sanitizeHorarioInput, update)
horarioRouter.patch('/:id', sanitizeHorarioInput, update)
horarioRouter.delete('/:id', remove)