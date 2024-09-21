import { Router } from "express";
import {sanitizeVet,findAll, findOne, add, update, remove } from "./vet.controler.js";

export const vetRouter = Router();

vetRouter.get('/', findAll)
vetRouter.get('/:id', findOne)
vetRouter.post('/', sanitizeVet, add)
vetRouter.put('/:id',sanitizeVet,  update)
vetRouter.delete('/:id',sanitizeVet ,remove)


