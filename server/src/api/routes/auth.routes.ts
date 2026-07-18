import { Router } from 'express';
import { loginUser } from "../../controllers/loginController.js";
import { registerUser, validaUser } from "../../controllers/userController.js";
import { upload } from '../../middlewares/upload.middleware.js';
const router = Router();

router.post('/loginUser', loginUser);

router.post('/registerUser', registerUser);

router.get('/validateCuenta/:token', validaUser);

router.post('/Register', upload.single('foto'), registerUser);



export default router;