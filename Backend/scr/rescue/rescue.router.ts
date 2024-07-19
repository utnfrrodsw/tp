import { Router } from "express";
import { sanitizeRescueInput, findAll, findOne, add, update, remove } from "./rescue.controler.js";

export const rescueRouter = Router();

rescueRouter.get('/', findAll)
rescueRouter.get('/:id', findOne)
rescueRouter.post('/', sanitizeRescueInput, add)
rescueRouter.put('/:id', sanitizeRescueInput, update)
rescueRouter.patch('/:id', sanitizeRescueInput, update)
rescueRouter.delete('/:id', sanitizeRescueInput, remove)
