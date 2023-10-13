import express from 'express';
/* import funciones from '../controllers/UserController.js' */
import { createUser, login, getAll, UpdateUser, UpdateUserPassword, getUserByToken, getUserRole } from '../controllers/UserController.mjs'
import { verifyTokenUser, verifyTokenAdmin } from '../middlewares/token.mjs'
const router = express.Router();

router.post('/user', createUser);
router.post('/login', login);
router.get('/users', verifyTokenUser, getAll);
router.get('/userbytoken', verifyTokenUser, getUserByToken);
router.put('/user-info', verifyTokenUser, UpdateUser);
router.put('/user-password', verifyTokenUser, UpdateUserPassword);
router.get('/user/role', verifyTokenUser, getUserRole);

export default router;