import { Router } from "express";
import { sanitizarParticipanteInput, findAll, findOne, registroParticipante, update, remove } from "./participante.controler.js";
export const participantesRouter = Router();
participantesRouter.get('/', findAll);
participantesRouter.get('/:id', findOne);
participantesRouter.post('/registro', sanitizarParticipanteInput, registroParticipante);
participantesRouter.put('/:id', sanitizarParticipanteInput, update);
participantesRouter.patch('/:id', sanitizarParticipanteInput, update);
participantesRouter.delete('/:id', remove);
//# sourceMappingURL=participante.routes.js.map