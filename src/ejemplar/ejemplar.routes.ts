import { Router } from "express";
import {
  buscarEjemplares,
  altaEjemplarManual,
  sanitizeInput,
  buscarEjemplar,
  bajaEjemplar,
  bajaEjemplares,
} from "./ejemplar.controller.js";
export const ejemplarRouter = Router({ mergeParams: true });

ejemplarRouter.get("/", buscarEjemplares);
ejemplarRouter.get("/:idEjemplar", buscarEjemplar);
ejemplarRouter.post("/", altaEjemplarManual);
ejemplarRouter.delete("/", bajaEjemplares);
ejemplarRouter.delete("/:idEjemplar", bajaEjemplar);
