import { Router } from "express";
import {
  buscaAutores,
  buscaAutor,
  altaAutor,
  sanitizeInput,
  actualizarAutor,
  bajaAutor,
} from "./autor.controller.js";

export const aRouter = Router();

aRouter.get("/", buscaAutores);
aRouter.get("/:id", buscaAutor);
aRouter.post("/", sanitizeInput, altaAutor);
aRouter.put("/:id", sanitizeInput, actualizarAutor);
aRouter.patch("/:id", sanitizeInput, actualizarAutor);
aRouter.delete("/:id", bajaAutor);
