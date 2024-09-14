import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./animal.controler.js";

export const animalRouter = Router();

animalRouter.get('/', findAll)
animalRouter.get('/:id', findOne)
animalRouter.post('/', add)
animalRouter.put('/:id',  update)
animalRouter.delete('/:id', remove)
