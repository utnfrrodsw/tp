import { Router } from "express";

import {
  retirarLibrosPaso1,
  retirarLibrosPaso2,
} from "./prestamo.controller.js";
export const prestamoRouter = Router();

prestamoRouter.get("/retirarLibrosPaso1", retirarLibrosPaso1);
prestamoRouter.get("/retirarLibrosPaso2", retirarLibrosPaso2);
