import { Router } from "express";
import {
  buscarSanciones,
  sanitizeInput,
  buscarSancion,
  buscarSancionesSocio,
  bajaSancion,
} from "./sancion.controller.js";
export const sancionRouter = Router();

sancionRouter.get("/", buscarSanciones);
sancionRouter.get("/socio", buscarSancionesSocio); //No idSocio en el params para respetar que sea el de sancion.
sancionRouter.get("/:id", buscarSancion);
sancionRouter.delete("/:id", bajaSancion);
