import { Router } from "express";
import {
  buscaAutores,
  buscaAutor,
  altaAutor,
  sanitizeInput,
  actualizarAutor,
  bajaAutor,
} from "./autor.controller.js";

export const autorRouter = Router();

autorRouter.get("/", buscaAutores);
autorRouter.get("/:id", buscaAutor);
autorRouter.post("/", sanitizeInput, altaAutor);
autorRouter.put("/:id", sanitizeInput, actualizarAutor);
autorRouter.patch("/:id", sanitizeInput, actualizarAutor);
autorRouter.delete("/:id", bajaAutor);
