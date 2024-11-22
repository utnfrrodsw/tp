import { Router } from "express";
import {
  buscarEjemplares,
  altaEjemplarManual,
  buscarEjemplar,
  bajaEjemplar,
  bajaEjemplares,
  actualizarEjemplar,
  validarEjemplarPendiente,
} from "./ejemplar.controller.js";
import {
  ejemplarAltaSchema,
  ejemplarPatchSchema,
} from "../schemas/schemas.ejemplar.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import { schemaParamsIdEjemplar } from "../schemas/schema.paramsId.js";
export const ejemplarRouter = Router({ mergeParams: true });

ejemplarRouter.get("/", buscarEjemplares);
ejemplarRouter.get(
  "/:idEjemplar",
  validateInput(schemaParamsIdEjemplar, undefined),
  buscarEjemplar
);
ejemplarRouter.post(
  "/",
  validateInput(undefined, ejemplarAltaSchema),
  altaEjemplarManual
);
ejemplarRouter.put(
  "/:idEjemplar",
  validateInput(ejemplarAltaSchema),
  actualizarEjemplar
);
ejemplarRouter.patch(
  "/:idEjemplar",
  validateInput(ejemplarPatchSchema),
  actualizarEjemplar
);
ejemplarRouter.delete("/", bajaEjemplares);
ejemplarRouter.delete(
  "/:idEjemplar",
  validateInput(schemaParamsIdEjemplar, undefined),
  bajaEjemplar
);
ejemplarRouter.get(
  "/:idEjemplar/pendiente",
  validateInput(schemaParamsIdEjemplar, undefined),
  validarEjemplarPendiente
);
