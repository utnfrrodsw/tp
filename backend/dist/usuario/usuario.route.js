import { Router } from "express";
import { sanitizeUsuarioInput, findall, findone, add, update, remove } from "./usuario.controler.js";
export const usuarioRouter = Router();
usuarioRouter.get("/", findall);
usuarioRouter.get("/:id", findone);
usuarioRouter.post("/", sanitizeUsuarioInput, add);
usuarioRouter.put("/:id", sanitizeUsuarioInput, update);
usuarioRouter.patch("/:id", sanitizeUsuarioInput, update);
usuarioRouter.delete("/:id", remove);
//# sourceMappingURL=usuario.route.js.map