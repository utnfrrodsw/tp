import { Router } from 'express';
import { sanitizeTreatmentInput, findAll, findOne, add, update, remove, } from './treatment.controller.js';
export const treatmentRouter = Router();
treatmentRouter.get('/', findAll);
treatmentRouter.get('/:id', findOne);
treatmentRouter.post('/', sanitizeTreatmentInput, add);
treatmentRouter.put('/:id', sanitizeTreatmentInput, update);
treatmentRouter.patch('/:id', sanitizeTreatmentInput, update);
treatmentRouter.delete('/:id', remove);
//# sourceMappingURL=treatment.routes.js.map