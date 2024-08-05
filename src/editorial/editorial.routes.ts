import { Router } from "express";
import {
  buscarEditoriales,
  buscarEditorial,
  altaEditorial,
  sanitizeInput,
  actualizarEditorial,
  bajaEditorial,
} from "./editorial.controller.js";

export const editorialRouter = Router();

editorialRouter.get("/", buscarEditoriales);
editorialRouter.get("/:id", buscarEditorial);
editorialRouter.post("/", sanitizeInput, altaEditorial);
editorialRouter.put("/:id", sanitizeInput, actualizarEditorial);
editorialRouter.patch("/:id", sanitizeInput, actualizarEditorial);
editorialRouter.delete("/:id", bajaEditorial);
