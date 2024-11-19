import { Router } from "express";

import {
  retirarLibrosPaso1R,
  retirarLibrosPaso2R,
  retirarLibrosPaso3R,
  devolverLibro,
  buscarPrestamos,
  buscarPrestamosSocio,
  buscarPrestamosNoDevueltosSocio,
  devolverLibroD,
} from "./prestamo.controller.js";
export const prestamoRouter = Router();

// Rutas viejas/ Acopladas.
prestamoRouter.get("/retirarLibrosPaso1R", retirarLibrosPaso1R);
prestamoRouter.get("/retirarLibrosPaso2R", retirarLibrosPaso2R);
prestamoRouter.post("/retirarLibrosPaso3R", retirarLibrosPaso3R);
prestamoRouter.patch("/devolverLibro", devolverLibro);

// Ruta con query params
prestamoRouter.get("/", buscarPrestamos);

// Rutas pendiente de mejorar los endpoints
prestamoRouter.get("/prestamosSocio", buscarPrestamosSocio);
prestamoRouter.get(
  "/prestamosNoDevueltosSocio",
  buscarPrestamosNoDevueltosSocio
);

// Rutas nuevas/ desacopladas
prestamoRouter.patch("/:id/lineas/:idLP/devolver", devolverLibroD);

// Ruta con query params
prestamoRouter.get("/", buscarPrestamos);

/* Query Params para buscarPrestamos:
/prestamos?estadoPrestamo=Pendiente
/prestamos?estadoPrestamo=Finalizado
*/
