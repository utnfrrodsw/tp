import express from 'express';
// Quitamos el 'import type' si no lo vas a usar acá mismo, 
// pero si lo necesitás, recordá que va arriba.
import { getUser, registerUser } from "../controllers/userController.js";
import { loginUser } from "../controllers/loginController.js";
import { validaUser } from "../controllers/userController.js";
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/verifica/:username', getUser);

router.post('/Login', loginUser);

router.post('/Register', upload.single('foto'), registerUser);

router.get('/validaCuenta/:token', validaUser) 

// Exportación moderna
export default router;