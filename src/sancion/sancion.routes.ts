import { Router } from "express";
import {
  buscarSanciones,
  buscarSancion,
  buscarSancionesSocio,
  bajaSancion,
} from "./sancion.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import { schemaParamsId } from "../schemas/schema.paramsId.js";
import { buscarSancionesSocioSchema } from "../schemas/schemas.sancion.js";
export const sancionRouter = Router({ mergeParams: true });

/* En lugar de esto (indiferenciable)
sancionRouter.get("/", buscarSanciones);
sancionRouter.get("/", buscarSancionesSocio);
Usar esto: */
sancionRouter.get("/", (req, res, next) => {
  // Valido el req.params.id en el router anterior para evitar problemas.
  const { id } = req.params as { id?: string }; // Si esta el campo id, activa la funcion de buscar sanciones socio (que viene del param de la ruta de socios)
  if (id) {
    return buscarSancionesSocio(req, res, next);
  }
  return buscarSanciones(req, res, next);
});

sancionRouter.get(
  "/:id",
  validateInput(schemaParamsId, undefined),
  buscarSancion
);
sancionRouter.delete(
  "/:id",
  validateInput(schemaParamsId, undefined),
  bajaSancion
);
