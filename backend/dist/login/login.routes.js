import { Router } from "express";
import { login } from "./login.controler.js";
export const loginRouter = Router();
loginRouter.post('/', login);
//# sourceMappingURL=login.routes.js.map