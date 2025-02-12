import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update, getAutores, getNombreCompleto, getPerfil, getInfo, findOneByNombreCompleto } from './Autor.controller.js';
import { isAuthenticated, isAdmin } from '../../middlewares/auth.middleware';
export const autorRouter = Router();
// Rutas públicas (no requieren autenticación)
autorRouter.get('/autores', getAutores);
autorRouter.get('/get-nombre-completo/:id', getNombreCompleto);
autorRouter.get('/perfil/:id', getPerfil);
autorRouter.get('/info/:id', getInfo);
autorRouter.get('/nombre-completo/:nombreCompleto', findOneByNombreCompleto);
autorRouter.get('/', findAll);
autorRouter.get('/:id', findOne);
// Rutas protegidas (solo accesibles para admins)
autorRouter.post("/", isAuthenticated, isAdmin, sanitizeInput, add);
autorRouter.put("/:id", isAuthenticated, isAdmin, sanitizeInput, update);
autorRouter.delete("/:id", isAuthenticated, isAdmin, remove);
autorRouter.patch('/:id', isAuthenticated, isAdmin, sanitizeInput, update); // Actualizar autor parcialmente
//# sourceMappingURL=Autor.routes.js.map