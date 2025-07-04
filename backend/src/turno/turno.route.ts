import { Router } from 'express';
import {
  sanitizeTurnoInput,
  findall,
  findone,
  add,
  update,
  remove,
} from './turno.controler.js';
export const turnoRouter = Router();

turnoRouter.get("/", findall);
turnoRouter.get("/:id", findone);
turnoRouter.post("/", sanitizeTurnoInput, add);
turnoRouter.put("/:id", sanitizeTurnoInput, update);
turnoRouter.patch("/:id", sanitizeTurnoInput, update);
turnoRouter.delete("/:id", remove);

