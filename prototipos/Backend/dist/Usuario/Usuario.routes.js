import { Router } from 'express';
import { findAll, sanitizeInput, add, remove, update, iniciarSesion, getByUsername, findOneByEmail, cerrarSesion, getIdUsuarioPorToken, getById } from './Usuario.controller.js';
export const usuarioRouter = Router();
// Otras rutas
usuarioRouter.post('/iniciar-sesion', iniciarSesion);
usuarioRouter.post('/cerrar-sesion', cerrarSesion);
usuarioRouter.get('/username/:username', getByUsername);
usuarioRouter.get('/email/:email', findOneByEmail);
usuarioRouter.get('/token/:token', getIdUsuarioPorToken);
usuarioRouter.get('/', findAll);
usuarioRouter.get('/:id', getById);
usuarioRouter.post('/', sanitizeInput, add);
usuarioRouter.put('/:id', sanitizeInput, update);
usuarioRouter.patch('/:id', sanitizeInput, update);
usuarioRouter.delete('/:id', remove);
//# sourceMappingURL=Usuario.routes.js.map