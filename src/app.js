import express from 'express';
import { initORM } from './shared/db/orm';
import authRoutes from './routes/auth.routes';
const app = express();
app.use(express.json());
initORM().then((orm) => {
    app.set('orm', orm);
    app.use('/auth', authRoutes);
    app.listen(3000, () => {
        console.log('Servidor corriendo en http://localhost:3000');
    });
}).catch((err) => {
    console.error('Error al inicializar MikroORM:', err);
});
