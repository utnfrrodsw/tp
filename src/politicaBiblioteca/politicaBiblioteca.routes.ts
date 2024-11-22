import { Router } from "express";

import {
  actualizarPoliticaBiblioteca,
  altaPoliticaBiblioteca,
  bajaPoliticaBiblioteca,
  buscarPoliticaBiblioteca,
} from "./politicaBiblioteca.controller.js";
import { validateInput } from "../middlewares/middleware.validateInput.js";
import {
  politicaBibliotecaPutSchema,
  politicaBibliotecaPatchSchema,
} from "../schemas/schemas.politicaBiblioteca.js";
export const politicaBibliotecaRouter = Router();

politicaBibliotecaRouter.get("/", buscarPoliticaBiblioteca);
politicaBibliotecaRouter.post(
  "/",
  validateInput(undefined, politicaBibliotecaPutSchema),
  altaPoliticaBiblioteca
); // Esto no deberia existir, se migra en producción.
politicaBibliotecaRouter.put(
  "/",
  validateInput(undefined, politicaBibliotecaPutSchema),
  actualizarPoliticaBiblioteca
);
politicaBibliotecaRouter.patch(
  "/",
  validateInput(undefined, politicaBibliotecaPatchSchema),
  actualizarPoliticaBiblioteca
);
politicaBibliotecaRouter.delete("/", bajaPoliticaBiblioteca); // Esto no deberia existir, se migra en producción.
