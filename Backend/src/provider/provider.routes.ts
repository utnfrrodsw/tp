import { Router } from 'express'
import { sanitizeProviderInput, findAll, findOne, add, update, remove } from './provider.controller.js'

export const providerRouter = Router()

providerRouter.get('/', findAll)
providerRouter.get('/:id', findOne)
providerRouter.post('/', sanitizeProviderInput, add)
providerRouter.put('/:id', sanitizeProviderInput, update)
providerRouter.patch('/:id', sanitizeProviderInput, update)
providerRouter.delete('/:id', remove)