import { Router } from "express";
import {
  buscaEjemplares,
  altaEjemplar,
  sanitizeInput,
} from "./ejemplar.controller.js";
export const ejemplarRouter = Router({ mergeParams: true });

ejemplarRouter.get("/", buscaEjemplares);
//ejemplarRouter.get("/:id", buscaEjemplar);
ejemplarRouter.post("/", sanitizeInput, altaEjemplar);
//ejemplarRouter.delete("/:id", bajaEjemplar);
