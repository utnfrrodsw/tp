import express from 'express';
import { authRoutes } from './routes/auth.routes';
import { usuarioRoutes } from './routes/usuario.routes';

const app = express(); 
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes); 

export default app;
