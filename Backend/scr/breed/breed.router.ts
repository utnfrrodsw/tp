import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  update,
  remove 
} from "./breed.controler.js";

export const breedRouter = Router();

breedRouter.get('/', findAll)
breedRouter.get('/:id', findOne)
breedRouter.post('/', add)
breedRouter.put('/:id', update)
// breedRouter.patch('/:id', sanitizeBreedInput, update)
breedRouter.delete('/:id', remove)