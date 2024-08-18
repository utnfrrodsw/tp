import { Router } from "express";
import { sanitizeVetInput, findAll, findOne, add, update, remove } from "./vet.controler.js";

export const vetRouter = Router();

vetRouter.get('/', findAll)
vetRouter.get('/:id', findOne)
vetRouter.post('/', sanitizeVetInput, add)
vetRouter.put('/:id', sanitizeVetInput, update)
vetRouter.patch('/:id', sanitizeVetInput, update)
vetRouter.delete('/:id', sanitizeVetInput, remove)