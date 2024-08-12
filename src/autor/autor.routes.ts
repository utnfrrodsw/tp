import { Router } from "express";
import {
  buscaAutores,
  buscaAutor,
  altaAutor,
  actualizarAutor,
  bajaAutor,
} from "./autor.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import { autorAltaSchema, autorPatchSchema } from "../schemas/schemas.autor.js";
import { schemaParamsId } from "../schemas/schema.paramsId.js";
export const autorRouter = Router();

autorRouter.get("/", buscaAutores);
autorRouter.get("/:id", validateInput(schemaParamsId, undefined), buscaAutor);
autorRouter.post("/", validateInput(undefined, autorAltaSchema), altaAutor);
autorRouter.put(
  "/:id",
  validateInput(schemaParamsId, autorAltaSchema),
  actualizarAutor
); // Mismo schema porque tiene que venir todos los datos si o si.
autorRouter.patch(
  "/:id",
  validateInput(schemaParamsId, autorPatchSchema),
  actualizarAutor
);
autorRouter.delete("/:id", validateInput(schemaParamsId, undefined), bajaAutor);
