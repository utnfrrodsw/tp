import { Router } from "express";
import { sanitizePriceInput, findAll, findOne, add, update, remove } from "./price.controler.js";

export const priceRouter = Router();

priceRouter.get('/', findAll)
priceRouter.get('/:id', findOne)
priceRouter.post('/', sanitizePriceInput, add)
priceRouter.put('/:id', sanitizePriceInput, update)
priceRouter.patch('/:id', sanitizePriceInput, update)
priceRouter.delete('/:id', sanitizePriceInput, remove)