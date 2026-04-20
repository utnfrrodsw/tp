// src/routes/permiso.routes.ts
import { Router } from 'express';
import {
  getPermisos,
  getPermisoById,
  createPermiso,
  updatePermiso,
  deletePermiso
} from '../controllers/permiso.controller';

const router = Router();

router.get('/', getPermisos);
router.get('/:id', getPermisoById);
router.post('/', createPermiso);
router.put('/:id', updatePermiso);
router.delete('/:id', deletePermiso);

export { router as permisoRoutes };
