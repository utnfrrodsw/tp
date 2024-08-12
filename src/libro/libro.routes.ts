import { Router } from "express";
import {
  buscaLibros,
  buscaLibro,
  altaLibro,
  actualizarLibro,
  bajaLibro,
} from "./libro.controller.js";
import { ejemplarRouter } from "../ejemplar/ejemplar.routes.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import { schemaParamsId } from "../schemas/schema.paramsId.js";
import {
  libroAltaSchema,
  libroPatchSchema,
  libroPutSchema,
} from "../schemas/schemas.libro.js";

export const libroRouter = Router();

libroRouter.get("/", buscaLibros);
libroRouter.get("/:id", validateInput(schemaParamsId, undefined), buscaLibro);
libroRouter.post("/", validateInput(undefined, libroAltaSchema), altaLibro);
libroRouter.put(
  "/:id",
  validateInput(schemaParamsId, libroPutSchema),
  actualizarLibro
);
libroRouter.patch(
  "/:id",
  validateInput(schemaParamsId, libroPatchSchema),
  actualizarLibro
);
libroRouter.delete("/:id", validateInput(schemaParamsId, undefined), bajaLibro);

libroRouter.use("/:id/ejemplares", ejemplarRouter); //La validación se hace en ejemplarRouter.
