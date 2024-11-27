import { Router } from "express";
import { sanitizepersonInput, findAll, findOne, add, update, remove } from "./person.controler.js";

export const personRouter = Router();

personRouter.get('/', findAll)
personRouter.get('/:id', findOne)
personRouter.post('/', sanitizepersonInput, add)
personRouter.put('/:id', sanitizepersonInput, update)
personRouter.patch('/:id', sanitizepersonInput, update)
personRouter.delete('/:id', sanitizepersonInput, remove)