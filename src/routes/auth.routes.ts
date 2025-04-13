// src/routes/auth.routes.ts
import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    await register(req, res);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    } else {
      console.error("Unknown error occurred");
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
});

router.post('/login', async (req, res) => {
  try {
    await login(req, res);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    } else {
      console.error("Unknown error occurred");
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
});

export default router; // Asegúrate de que esta línea esté al final del archivo
