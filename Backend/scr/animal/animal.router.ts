import { Router } from "express";
import { sanitizeAnimalInput, findAll, findOne, add, update, remove } from "./animal.controler.js";

export const animalRouter = Router();

animalRouter.get('/', findAll)
animalRouter.get('/:id', findOne)
animalRouter.post('/', sanitizeAnimalInput, add)
animalRouter.put('/:id', sanitizeAnimalInput, update)
animalRouter.patch('/:id', sanitizeAnimalInput, update)
animalRouter.delete('/:id', sanitizeAnimalInput, remove)
