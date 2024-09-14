import { Router } from "express";
import {  findAll, findOne, add, update, remove } from "./rescue.controler.js";

export const rescueRouter = Router();

rescueRouter.get('/', findAll)
rescueRouter.get('/:id', findOne)
rescueRouter.post('/',  add)
rescueRouter.patch('/:id', update)
rescueRouter.delete('/:id', remove)
rescueRouter.put('/:id', update)
