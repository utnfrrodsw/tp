import { Router } from "express";
import {
  buscaLibros,
  buscaLibro,
  altaLibro,
  sanitizeInput,
  actualizarLibro,
  bajaLibro,
} from "./libro.controller.js";

export const libroRouter = Router();

libroRouter.get("/", buscaLibros);
libroRouter.get("/:id", buscaLibro);
libroRouter.post("/", sanitizeInput, altaLibro);
libroRouter.put("/:id", sanitizeInput, actualizarLibro);
libroRouter.patch("/:id", sanitizeInput, actualizarLibro);
libroRouter.delete("/:id", bajaLibro);
