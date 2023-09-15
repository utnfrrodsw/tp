import { Router } from 'express';
import { sanitizeModoEnvioInput, findAll, findOne, add, update, remove  } from './modoEnvio.controler.js';

const modoEnvioRouter = Router();


modoEnvioRouter.get('/', findAll);
modoEnvioRouter.get('/:id', findOne);
modoEnvioRouter.post('/', sanitizeModoEnvioInput, add);
modoEnvioRouter.put('/:id', sanitizeModoEnvioInput, update);
modoEnvioRouter.patch('/:id', sanitizeModoEnvioInput, update);
modoEnvioRouter.delete('/:id', remove);

export { modoEnvioRouter };
