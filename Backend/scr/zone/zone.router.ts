import { Router } from "express";
import { sanitizeZoneInput, findAll, findOne, add, update, remove } from "./zone.controler.js";

export const zoneRouter = Router();

zoneRouter.get('/', findAll)
zoneRouter.get('/:id', findOne)
zoneRouter.post('/', sanitizeZoneInput, add)
zoneRouter.put('/:id', sanitizeZoneInput, update)
zoneRouter.patch('/:id', sanitizeZoneInput, update)
zoneRouter.delete('/:id', sanitizeZoneInput, remove)