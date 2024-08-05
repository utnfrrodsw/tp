import { Router } from "express";
import {
  buscarPoliticasSancion,
  altaPoliticaSancion,
  sanitizeInput,
  buscarPoliticaSancion,
  bajaPoliticaSancion,
  actualizarPoliticaSancion,
} from "./politicaSancion.controller.js";
export const politicaSancionRouter = Router();

politicaSancionRouter.get("/", buscarPoliticasSancion);
politicaSancionRouter.get("/:id", buscarPoliticaSancion);
politicaSancionRouter.post("/", sanitizeInput, altaPoliticaSancion);
politicaSancionRouter.put("/:id", sanitizeInput, actualizarPoliticaSancion);
politicaSancionRouter.patch("/:id", sanitizeInput, actualizarPoliticaSancion);
politicaSancionRouter.delete("/:id", bajaPoliticaSancion);
