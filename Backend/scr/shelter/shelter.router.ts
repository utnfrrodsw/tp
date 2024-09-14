import { Router } from "express";
import {findAll, findOne, add, update, remove } from "./shelter.controler.js";

export const shelterRouter = Router();

shelterRouter.get('/', findAll)
shelterRouter.get('/:id', findOne)
shelterRouter.post('/',  add)
shelterRouter.put('/:id',  update)
shelterRouter.patch('/:id',  update)
shelterRouter.delete('/:id',  remove)
