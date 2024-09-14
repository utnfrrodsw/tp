import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  sanitizePersonInput
} from "./person.controler.js";

export const personRouter = Router();

personRouter.get('/', findAll)
personRouter.get('/:id', findOne)
personRouter.post('/', sanitizePersonInput, add)
personRouter.put('/:id', sanitizePersonInput, update)
personRouter.delete('/:id', sanitizePersonInput, remove)
