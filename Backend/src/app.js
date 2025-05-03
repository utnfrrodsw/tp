// src/app.ts
import express from 'express';
import { authRoutes } from './routes/auth.routes';
// si querés agregar otras rutas luego, importalas acá
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes); // por ejemplo
export default app;
