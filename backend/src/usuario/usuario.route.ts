import { Router } from 'express';
import {
  validateBody,
  validateParams,
  validateQuery,
  authenticateToken,
} from '../utils/apiMiddleware.js';
import {
  createUsuarioValidation,
  updateUsuarioValidation,
  loginValidation,
  recuperarContrasenaValidation,
  validarCodigoValidation,
  cambiarPasswordValidation,
  idParamValidation,
  userIdParamValidation,
  paginationQueryValidation,
  findPrestatariosByTipoServicioAndZonaParamsSchema,
  findPrestatariosByTipoServicioAndZonaQuerySchema,
} from './usuario.schemas.js';
import {
  findAll,
  add,
  update,
  remove,
  findOne,
  findOneOnlyInfo,
  loginUsuario,
  recuperarContrasena,
  validarCodigoRecuperacion,
  cambiarPassword,
  uploadProfileImage,
  getCommentsByUserId,
  findOneByCookie,
  findPrestatariosByTipoServicioAndZona,
} from './usuario.controler.js';
import { uploadProfile } from '../utils/uploadMiddleware.js';

const usuarioRouter = Router();

// ==================== POST ROUTES ====================
usuarioRouter.post('/', validateBody(createUsuarioValidation), add);

usuarioRouter.post(
  '/recuperar',
  validateBody(recuperarContrasenaValidation),
  recuperarContrasena
);

usuarioRouter.post(
  '/validar-codigo',
  validateBody(validarCodigoValidation),
  validarCodigoRecuperacion
);

usuarioRouter.post(
  '/cambiar-password',
  validateBody(cambiarPasswordValidation),
  cambiarPassword
);

usuarioRouter.post(
  '/upload-profile-image/:userId',
  uploadProfile.single('profileImage'),
  validateParams(userIdParamValidation),
  uploadProfileImage
);

// ==================== GET ROUTES ====================
usuarioRouter.get('/login', validateQuery(loginValidation), loginUsuario);

usuarioRouter.get('/', findAll);

usuarioRouter.get('/cookie', authenticateToken, findOneByCookie);

usuarioRouter.get(
  '/onlyInfo/:id',
  validateParams(idParamValidation),
  findOneOnlyInfo
);

usuarioRouter.get(
  '/comments/:id',
  validateParams(idParamValidation),
  validateQuery(paginationQueryValidation),
  getCommentsByUserId
);

usuarioRouter.get(
  '/prestatarios/:tipoServicio/:tarea/:zona/:orderBy',
  validateParams(findPrestatariosByTipoServicioAndZonaParamsSchema),
  validateQuery(findPrestatariosByTipoServicioAndZonaQuerySchema),
  findPrestatariosByTipoServicioAndZona
);

usuarioRouter.get('/:id', validateParams(idParamValidation), findOne);

// ==================== PUT ROUTES ====================
usuarioRouter.put(
  '/:id',
  validateParams(idParamValidation),
  validateBody(updateUsuarioValidation),
  update
);

// ==================== DELETE ROUTES ====================
usuarioRouter.delete('/:id', validateParams(idParamValidation), remove);

export { usuarioRouter };
