import { Router } from "express";
import { sanitizebuyInput, findAll, findOne, add, update, remove } from "./buy.controler.js";

export const buyRouter = Router();

buyRouter.get('/', findAll)
buyRouter.get('/:id', findOne)
buyRouter.post('/', sanitizebuyInput, add)
buyRouter.put('/:id', sanitizebuyInput, update)
buyRouter.patch('/:id', sanitizebuyInput, update)
buyRouter.delete('/:id', sanitizebuyInput, remove)