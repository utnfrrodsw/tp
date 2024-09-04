import { Router } from "express";
import { sanitizarParticipanteInput, findAll, findOne, add, update, remove } from "./participante.controler.js";
export const participantesRouter = Router();
participantesRouter.get('/', findAll);
participantesRouter.get('/:id', findOne);
participantesRouter.post('/', sanitizarParticipanteInput, add);
participantesRouter.put('/:id', sanitizarParticipanteInput, update);
participantesRouter.patch('/:id', sanitizarParticipanteInput, update);
participantesRouter.delete('/:id', remove);
//# sourceMappingURL=participante.routes.js.map