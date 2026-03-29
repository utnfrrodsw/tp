import { Router } from 'express'
import { sanitizeEmployeeInput, findAll, findOne, add, update, remove } from './employee.controller.js'

export const employeeRouter = Router()

employeeRouter.get('/', findAll)
employeeRouter.get('/:id', findOne)
employeeRouter.post('/', sanitizeEmployeeInput, add)
employeeRouter.put('/:id', sanitizeEmployeeInput, update)
employeeRouter.patch('/:id', sanitizeEmployeeInput, update)
employeeRouter.delete('/:id', remove)