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
export const sancionRouter = Router();

sancionRouter.get("/", buscarSanciones);
sancionRouter.get(
  "/socio",
  validateInput(undefined, buscarSancionesSocioSchema),
  buscarSancionesSocio
); //No idSocio en el params para respetar que sea el de sancion.
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
