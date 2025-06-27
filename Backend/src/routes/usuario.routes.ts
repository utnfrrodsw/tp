import { Router } from 'express';
import { getUsuarios, getUsuarioById, updateUsuario, deleteUsuario, createUsuario } from '../controllers/usuario.controller';

const router = Router();

router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);
router.post('/', createUsuario);

export { router as usuarioRoutes };

