import express from 'express';
/* import funciones from '../controllers/UserController.js' */
import {createUser, login, getAll, UpdateUser, UpdateUserPassword } from '../controllers/UserController.mjs'
import {verifyTokenUser, verifyTokenAdmin } from '../middlewares/token.mjs'
const router = express.Router();

router.post('/user', createUser);
router.post('/login', login);
router.get('/users', verifyTokenUser, getAll);
router.put('/user-info', verifyTokenUser, UpdateUser);
router.put('/user-password', verifyTokenUser, UpdateUserPassword);

export default router;