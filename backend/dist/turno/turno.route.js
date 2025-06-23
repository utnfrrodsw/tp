import { Router } from 'express';
<<<<<<< HEAD
import { sanitizeTurnoInput, findall, add, } from './turno.controler.js';
export const turnoRouter = Router();
turnoRouter.get('/', findall);
//turnoRouter.get("/:fecha/:hora/:usuario/:servicio", findone);
turnoRouter.post('/', sanitizeTurnoInput, add);
//turnoRouter.put("/:fecha/:hora/:usuario/:servicio", sanitizeTurnoInput, update);
//turnoRouter.patch("/:fecha/:hora/:usuario/:servicio", sanitizeTurnoInput, update);
//turnoRouter.delete("/:fecha/:hora/:usuario/:servicio", remove);
=======
import { sanitizeTurnoInput, findall, findone, add, update, remove } from './turno.controler.js';
export const turnoRouter = Router();
turnoRouter.get("/", findall);
turnoRouter.get("/:fecha/:hora/:usuario/:servicio", findone);
turnoRouter.post("/", sanitizeTurnoInput, add);
turnoRouter.put("/:fecha/:hora/:usuario/:servicio", sanitizeTurnoInput, update);
turnoRouter.patch("/:fecha/:hora/:usuario/:servicio", sanitizeTurnoInput, update);
turnoRouter.delete("/:fecha/:hora/:usuario/:servicio", remove);
>>>>>>> luis
//# sourceMappingURL=turno.route.js.map