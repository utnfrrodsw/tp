import { Router } from "express";
import {
  buscarEditoriales,
  buscarEditorial,
  altaEditorial,
  actualizarEditorial,
  bajaEditorial,
} from "./editorial.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import {
  editorialAltaSchema,
  editorialPatchSchema,
} from "../schemas/schemas.editorial.js";
import { schemaParamsId } from "../schemas/schema.paramsId.js";
export const editorialRouter = Router();

editorialRouter.get("/", buscarEditoriales);
editorialRouter.get(
  "/:id",
  validateInput(schemaParamsId, undefined),
  buscarEditorial
);
editorialRouter.post(
  "/",
  validateInput(undefined, editorialAltaSchema),
  altaEditorial
);
editorialRouter.put(
  "/:id",
  validateInput(schemaParamsId, editorialAltaSchema),
  actualizarEditorial
);
editorialRouter.patch(
  "/:id",
  validateInput(schemaParamsId, editorialPatchSchema),
  actualizarEditorial
); // Por el momento no tiene sentido, solo hay 1 campo a modificar.
editorialRouter.delete(
  "/:id",
  validateInput(schemaParamsId, undefined),
  bajaEditorial
);
