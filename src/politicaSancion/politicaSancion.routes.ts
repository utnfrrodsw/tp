import { Router } from "express";
import {
  buscarPoliticasSancion,
  altaPoliticaSancion,
  buscarPoliticaSancion,
  bajaPoliticaSancion,
  actualizarPoliticaSancion,
} from "./politicaSancion.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import { schemaParamsId } from "../schemas/schema.paramsId.js";
import {
  politicaSancionAltaSchema,
  politicaSancionPutSchema,
} from "../schemas/schemas.politicaSancion.js";
export const politicaSancionRouter = Router();

politicaSancionRouter.get("/", buscarPoliticasSancion);
politicaSancionRouter.get(
  "/:id",
  validateInput(schemaParamsId, undefined),
  buscarPoliticaSancion
);
politicaSancionRouter.post(
  "/",
  validateInput(undefined, politicaSancionAltaSchema),
  altaPoliticaSancion
);
politicaSancionRouter.put(
  "/:id",
  validateInput(schemaParamsId, politicaSancionPutSchema),
  actualizarPoliticaSancion
);
// .patch("/:id",(validacion), actualizarPoliticaSancion);
politicaSancionRouter.delete(
  "/:id",
  validateInput(schemaParamsId, undefined),
  bajaPoliticaSancion
);
