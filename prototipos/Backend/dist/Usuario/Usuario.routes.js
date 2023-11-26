import { Router } from 'express';
import { findAll, sanitizeInput, add, remove, update, iniciarSesion, getByUsername, findOneByEmail, cerrarSesion, getById, getNombre, getApellido, getEmail, getUsername, getTipo, checkToken, setNombre, setApellido, setEmail, setUsername, setTipo } from './Usuario.controller.js';
export const usuarioRouter = Router();
// Otras rutas
usuarioRouter.post('/iniciar-sesion', iniciarSesion);
usuarioRouter.post('/cerrar-sesion', cerrarSesion);
usuarioRouter.get('/username/:username', getByUsername);
usuarioRouter.get('/email/:email', findOneByEmail);
usuarioRouter.get('/check-token', checkToken);
// Getters
usuarioRouter.get('/get-nombre', getNombre);
usuarioRouter.get('/get-apellido', getApellido);
usuarioRouter.get('/get-email', getEmail);
usuarioRouter.get('/get-username', getUsername);
usuarioRouter.get('/get-tipo', getTipo);
// Setters
usuarioRouter.put('/set-nombre', sanitizeInput, setNombre);
usuarioRouter.put('/set-apellido', sanitizeInput, setApellido);
usuarioRouter.put('/set-email', sanitizeInput, setEmail);
usuarioRouter.put('/set-username', sanitizeInput, setUsername);
usuarioRouter.put('/set-tipo', sanitizeInput, setTipo);
usuarioRouter.get('/', findAll);
usuarioRouter.get('/:id', getById);
usuarioRouter.post('/', sanitizeInput, add);
usuarioRouter.put('/:id', sanitizeInput, update);
usuarioRouter.patch('/:id', sanitizeInput, update);
usuarioRouter.delete('/', remove);
//# sourceMappingURL=Usuario.routes.js.map