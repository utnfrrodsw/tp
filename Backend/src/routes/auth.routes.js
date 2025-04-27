import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
const router = Router();
// Ruta para el registro de usuario (No requiere autenticación)
router.post('/register', async (req, res) => {
    try {
        await register(req, res); // Llamamos a la función de registro
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
        }
        else {
            console.error("Unknown error occurred");
            res.status(500).json({ error: "Unknown error occurred" });
        }
    }
});
// Ruta para el login de usuario (No requiere autenticación)
router.post('/login', async (req, res) => {
    try {
        await login(req, res); // Llamamos a la función de login
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
        }
        else {
            console.error("Unknown error occurred");
            res.status(500).json({ error: "Unknown error occurred" });
        }
    }
});
// Aquí podrían ir otras rutas protegidas por el middleware 'authMiddleware', por ejemplo:
// router.get('/profile', authMiddleware, (req, res) => {
//   res.json({ message: 'User profile data' });
// });
export default router;
