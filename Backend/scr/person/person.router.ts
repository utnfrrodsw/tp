import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  update,
  remove 
} from "./person.controler.js";

export const personRouter = Router();

personRouter.get('/', findAll)
personRouter.get('/:id', findOne)
personRouter.post('/', add)
personRouter.put('/:id', update)
personRouter.delete('/:id', remove)