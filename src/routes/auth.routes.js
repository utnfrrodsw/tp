// src/routes/auth.routes.ts
import { Router } from 'express';
import { register, login } from '../controllers/auth.controller'; // Asegúrate de que sean importadas correctamente
const router = Router();
// Asegúrate de que las funciones 'register' y 'login' sean funciones asíncronas y retornen una respuesta de tipo 'Response'.
router.post('/register', async (req, res) => {
    await register(req, res); // Llamada asíncrona a la función 'register'
});
router.post('/login', async (req, res) => {
    await login(req, res); // Llamada asíncrona a la función 'login'
});
export default router;
