import { Router } from "express";
import {
  buscaEditoriales,
  buscaEditorial,
  altaEditorial,
  sanitizeInput,
  actualizarEditorial,
  bajaEditorial,
} from "./editorial.controller.js";

export const editorialRouter = Router();

editorialRouter.get("/", buscaEditoriales);
editorialRouter.get("/:id", buscaEditorial);
editorialRouter.post("/", sanitizeInput, altaEditorial);
editorialRouter.put("/:id", sanitizeInput, actualizarEditorial);
editorialRouter.patch("/:id", sanitizeInput, actualizarEditorial);
editorialRouter.delete("/:id", bajaEditorial);
