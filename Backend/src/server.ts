import 'reflect-metadata';
import express from 'express';
import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './shared/mikro-orm.config'; // Ruta ajustada si lo moviste

const app = express();
app.use(express.json());

const startServer = async () => {
  try {
    const orm = await MikroORM.init(mikroOrmConfig);
    console.log('📦 Conectado a MySQL');

    // Aquí registrás tus rutas, por ejemplo:
    // app.use('/auth', authRoutes);

    app.listen(3000, () => {
      console.log('🚀 Servidor en puerto 3000');
    });
  } catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err);
  }
};

startServe r();
