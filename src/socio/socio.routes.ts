import { Router } from "express";
import {
  buscarSocio,
  altaSocio,
  sanitizeInput,
  buscarSocios,
  bajaSocio,
  actualizarSocio,
} from "./socio.controller.js";
export const socioRouter = Router();

socioRouter.get("/", buscarSocios);
socioRouter.get("/:id", buscarSocio);
socioRouter.post("/", sanitizeInput, altaSocio);
socioRouter.put("/:id", sanitizeInput, actualizarSocio);
socioRouter.patch("/:id", sanitizeInput, actualizarSocio);
socioRouter.delete("/:id", bajaSocio);
