import { Router } from "express";
import { 
  sanitizeShelterInput, 
  findAll, 
  findOne, 
  add, 
  update, 
  remove 
} from "./shelter.controler.js";

export const shelterRouter = Router();

shelterRouter.get('/', findAll)
shelterRouter.get('/:id', findOne)
shelterRouter.post('/', sanitizeShelterInput, add)
shelterRouter.put('/:id', sanitizeShelterInput, update)
shelterRouter.patch('/:id', sanitizeShelterInput, update)
shelterRouter.delete('/:id', sanitizeShelterInput, remove)
