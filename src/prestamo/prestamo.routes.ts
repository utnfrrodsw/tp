import { Router } from "express";

import {
  retirarLibrosPaso1R,
  retirarLibrosPaso2R,
  retirarLibrosPaso3R,
  devolverLibro,
  buscarPrestamos,
  buscarPrestamosSocio,
  buscarPrestamosNoDevueltosSocio,
} from "./prestamo.controller.js";
export const prestamoRouter = Router();

prestamoRouter.get("/retirarLibrosPaso1R", retirarLibrosPaso1R);
prestamoRouter.get("/retirarLibrosPaso2R", retirarLibrosPaso2R);
prestamoRouter.post("/retirarLibrosPaso3R", retirarLibrosPaso3R);
prestamoRouter.patch("/devolverLibro", devolverLibro);
prestamoRouter.get("/", buscarPrestamos);
prestamoRouter.get("/prestamosSocio", buscarPrestamosSocio);
prestamoRouter.get(
  "/prestamosNoDevueltosSocio",
  buscarPrestamosNoDevueltosSocio
);
