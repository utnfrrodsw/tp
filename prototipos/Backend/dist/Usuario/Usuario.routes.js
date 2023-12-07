import { Router } from 'express';
import { findAll, sanitizeInput, add, remove, update, iniciarSesion, getByUsername, findOneByEmail, cerrarSesion, getById, getNombre, getApellido, getEmail, getUsername, getTipo, checkToken, setNombre, setApellido, setEmail, setUsername, setTipo, getUsernameById, getNombreById, getApellidoById, getEmailById, getAvatarById, getTipoById, getUsuarios, eliminarCuenta, getDireccion, setDireccion, setProvincia } from './Usuario.controller.js';
export const usuarioRouter = Router();
// ADMIN
usuarioRouter.put('/set-tipo/:id', sanitizeInput, setTipo);
// Otras rutas
usuarioRouter.post('/iniciar-sesion', iniciarSesion);
usuarioRouter.post('/cerrar-sesion', cerrarSesion);
usuarioRouter.get('/username/:username', getByUsername);
usuarioRouter.get('/email/:email', findOneByEmail);
usuarioRouter.get('/check-token', checkToken);
usuarioRouter.delete('/', eliminarCuenta);
// Getters con permisos (token)
usuarioRouter.get('/get-nombre', getNombre);
usuarioRouter.get('/get-apellido', getApellido);
usuarioRouter.get('/get-email', getEmail);
usuarioRouter.get('/get-username', getUsername);
usuarioRouter.get('/get-tipo', getTipo);
usuarioRouter.get('/get-direccion', getDireccion);
// Getters
usuarioRouter.get('/get-username/:id', getUsernameById);
usuarioRouter.get('/get-nombre/:id', getNombreById);
usuarioRouter.get('/get-apellido/:id', getApellidoById);
usuarioRouter.get('/get-email/:id', getEmailById);
usuarioRouter.get('/get-avatar/:id', getAvatarById);
usuarioRouter.get('/get-tipo/:id', getTipoById);
usuarioRouter.get('/usuarios', getUsuarios);
// Setters
usuarioRouter.put('/set-nombre', sanitizeInput, setNombre);
usuarioRouter.put('/set-apellido', sanitizeInput, setApellido);
usuarioRouter.put('/set-email', sanitizeInput, setEmail);
usuarioRouter.put('/set-username', sanitizeInput, setUsername);
usuarioRouter.put('/set-direccion', sanitizeInput, setDireccion);
usuarioRouter.put('/set-provincia', sanitizeInput, setProvincia);
usuarioRouter.get('/', findAll);
usuarioRouter.get('/:id', getById);
usuarioRouter.post('/', sanitizeInput, add);
usuarioRouter.put('/:id', sanitizeInput, update);
usuarioRouter.patch('/:id', sanitizeInput, update);
usuarioRouter.delete('/:id', remove);
//# sourceMappingURL=Usuario.routes.js.map