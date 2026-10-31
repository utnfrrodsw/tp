import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { randomBytes } from 'crypto';
import { fileURLToPath } from 'url';
import authRoutes from './modules/auth/routes/auth.routes.js';
import eventoRoutes from './modules/eventos/routes/evento.routes.js';
import usuarioRoutes from './modules/usuarios/routes/usuario.routes.js';
import statsRoutes from './modules/stats/routes/stats.routes.js';
import categoriaRoutes from './modules/categorias/routes/categoria.routes.js';
import servicioRoutes from './modules/servicios/routes/servicio.routes.js';
import tableroRoutes from './modules/tableros/routes/tablero.routes.js';
import paymentRoutes from './modules/payment/routes/payment.routes.js';
import { apiErrorHandler, respondWithError } from './shared/api-error.js';
const nombreArchivoActual = fileURLToPath(import.meta.url);
const carpetaActual = path.dirname(nombreArchivoActual);
dotenv.config({ path: path.resolve(carpetaActual, '../../../.env') });
if (!process.env.JWT_SECRET) {
    if (process.env.NODE_ENV === 'production')
        throw new Error('JWT_SECRET es obligatorio en producción');
    process.env.JWT_SECRET = randomBytes(32).toString('hex');
    console.warn('JWT_SECRET temporal: las sesiones expirarán al reiniciar la API');
}
const app = express();
const PORT = process.env.PORT || 4000;
// CORS solo se activa si se configuran orígenes externos permitidos
const corsOriginsEnv = process.env.CORS_ORIGINS;
const corsOrigins = [];
if (corsOriginsEnv) {
    const partes = corsOriginsEnv.split(',');
    for (const parte of partes) {
        const origen = parte.trim();
        if (origen !== '') {
            corsOrigins.push(origen);
        }
    }
}
if (corsOrigins.length > 0) {
    app.use(cors({ origin: corsOrigins }));
}
app.use(express.json());
// Diagnóstico: no toca la base de datos, así que responde aunque la conexión falle.
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'API de planIt funcionando'
    });
});
app.use('/api/auth', authRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/tableros', tableroRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api', (_req, res) => {
    respondWithError(res, 404, 'NOT_FOUND', 'Ruta de API no encontrada');
});
app.use(apiErrorHandler);
app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});
export default app;
