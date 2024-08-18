import { Router } from "express";
import { sanitizeBreedInput, findAll, findOne, add, update, remove } from "./breed.controler.js";

export const breedRouter = Router();

breedRouter.get('/', findAll)
breedRouter.get('/:id', findOne)
breedRouter.post('/', sanitizeBreedInput, add)
breedRouter.put('/:id', sanitizeBreedInput, update)
breedRouter.patch('/:id', sanitizeBreedInput, update)
breedRouter.delete('/:id', sanitizeBreedInput, remove)