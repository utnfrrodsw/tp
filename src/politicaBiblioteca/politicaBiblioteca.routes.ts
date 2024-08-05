import { Router } from "express";

import {
  actualizarPoliticaBiblioteca,
  altaPoliticaBiblioteca,
  bajaPoliticaBiblioteca,
  buscarPoliticaBiblioteca,
  sanitizeInput,
} from "./politicaBiblioteca.controller.js";
export const politicaBibliotecaRouter = Router();

politicaBibliotecaRouter.get("/", buscarPoliticaBiblioteca);
politicaBibliotecaRouter.post("/", sanitizeInput, altaPoliticaBiblioteca);
politicaBibliotecaRouter.put("/", sanitizeInput, actualizarPoliticaBiblioteca);
politicaBibliotecaRouter.patch(
  "/",
  sanitizeInput,
  actualizarPoliticaBiblioteca
);
politicaBibliotecaRouter.delete("/", bajaPoliticaBiblioteca);
