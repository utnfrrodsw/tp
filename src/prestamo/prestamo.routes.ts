import { Router } from "express";

import {
  retirarLibrosPaso1R,
  retirarLibrosPaso2R,
  retirarLibrosPaso3R,
  devolverLibro,
  buscarPrestamos,
  buscarPrestamosSocio,
  buscarEjemplaresPendientesSocio,
  devolverLibroD,
} from "./prestamo.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import {
  devolverLibroParams,
  devolverLibroRequest,
} from "../schemas/schemas.casosDeUso.js";
export const prestamoRouter = Router({ mergeParams: true });

// Rutas viejas/ Acopladas.
prestamoRouter.get("/retirarLibrosPaso1R", retirarLibrosPaso1R);
prestamoRouter.get("/retirarLibrosPaso2R", retirarLibrosPaso2R);
prestamoRouter.post("/retirarLibrosPaso3R", retirarLibrosPaso3R);

// prestamoRouter.patch("/devolverLibro", devolverLibro);  DEPRECADO.

// Rutas nuevas/ desacopladas

prestamoRouter.get("/", (req, res, next) => {
  // Valido el req.params.id en el router anterior para evitar problemas.
  const { id } = req.params as { id?: string };
  if (id) {
    return buscarPrestamosSocio(req, res, next);
  }
  return buscarPrestamos(req, res, next);
});
prestamoRouter.get(
  "/listarEjemplaresPendientes",
  buscarEjemplaresPendientesSocio
); // Podria moverse a ejemplares quizas. (Actualmente esta anidada a socio) No hay query params, no tiene sentido.

prestamoRouter.patch(
  "/:id/lineas/:idLP/devolver",
  validateInput(devolverLibroParams, devolverLibroRequest),
  devolverLibroD
); // Linea préstamo no tiene controlador ni rutas, por eso el endpoint este.

/* Query Params para buscarPrestamos y buscarPrestamosSocio:
/prestamos?estadoPrestamo=Pendiente
/prestamos?estadoPrestamo=Finalizado
*/
