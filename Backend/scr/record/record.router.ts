import { Router } from "express";
import { sanitizeRecordInput, findAll, findOne, add, update, remove } from "./record.controler.js";

export const recordRouter = Router();

recordRouter.get('/', findAll)
recordRouter.get('/:id', findOne)
recordRouter.post('/', sanitizeRecordInput, add)
recordRouter.put('/:id', sanitizeRecordInput, update)
recordRouter.patch('/:id', sanitizeRecordInput, update)
recordRouter.delete('/:id', sanitizeRecordInput, remove)