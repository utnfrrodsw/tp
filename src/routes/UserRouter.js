import express from 'express';
import funciones from '../controllers/UserController.js'
import middlewares from '../middlewares/token.js'
const router = express.Router();

router.post('/user', funciones.createUser);
router.post('/login', funciones.login);
router.get('/users', middlewares.verifyTokenUser, funciones.getAll);
router.put('/user-info', middlewares.verifyTokenUser, funciones.UpdateUser);
router.put('/user-password', middlewares.verifyTokenUser, funciones.UpdateUserPassword);

export default router;