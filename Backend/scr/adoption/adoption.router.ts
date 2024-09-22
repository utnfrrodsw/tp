import { Router } from "express";
import { sanitizeAdoptionInput, findAll, findOne, add, update, remove } from "./adoption.controler.js";

export const adoptionRouter = Router();

adoptionRouter.get('/', findAll)
adoptionRouter.get('/:id', findOne)
adoptionRouter.post('/', sanitizeAdoptionInput, add)
adoptionRouter.put('/:id', sanitizeAdoptionInput, update)
adoptionRouter.patch('/:id', sanitizeAdoptionInput, update)
adoptionRouter.delete('/:id', sanitizeAdoptionInput, remove)