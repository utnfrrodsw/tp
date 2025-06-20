import { Router } from 'express';
import { findAll, findOne, add, update, remove, } from './zona.controller.js';
export const zonaRouter = Router();
zonaRouter.get("/", findAll);
zonaRouter.get("/:id", findOne);
zonaRouter.post("/", add);
zonaRouter.put("/:id", update);
zonaRouter.patch("/:id", update);
zonaRouter.delete("/:id", remove);
//# sourceMappingURL=zona.route.js.map