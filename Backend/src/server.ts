// src/server.ts
import 'reflect-metadata';  // Esto es necesario para los decoradores
import express from 'express';
import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './mikro-orm.config';  // Importamos la configuración de MikroORM
import authRoutes from './routes/auth.routes'; // Rutas de autenticación

const app = express();

app.use(express.json());

const startServer = async () => {
  try {
    // Iniciamos MikroORM con la configuración importada
    const ormInstance = await MikroORM.init(mikroOrmConfig);
    console.log('Base de datos conectada');
    
    // Registra las rutas de autenticación
    app.use('/auth', authRoutes); // Esto añade el prefijo '/auth' a todas las rutas definidas en authRoutes

    app.listen(3000, () => {
      console.log('Servidor en el puerto 3000');
    });
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
  }
};

startServer();