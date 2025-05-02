import express from 'express';
import 'reflect-metadata';
import { initORM } from './shared/orm'; // Asegúrate de importar 'initORM'
import authRoutes from './routes/auth.routes'; // Importa las rutas de autenticación
const app = express();
app.use(express.json());
const startServer = async () => {
    try {
        const ormInstance = await initORM(); // Esperamos que ORM se inicie correctamente
        console.log('Base de datos conectada');
        // Registra las rutas de autenticación
        app.use('/auth', authRoutes); // Esto añade el prefijo '/auth' a todas las rutas definidas en authRoutes
        app.listen(3000, () => {
            console.log('Servidor en el puerto 3000');
        });
    }
    catch (err) {
        console.error('Error al conectar a la base de datos:', err);
    }
};
startServer();
