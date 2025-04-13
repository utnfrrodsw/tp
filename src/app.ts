// src/app.ts
import express from 'express';
import { initORM } from './shared/db/orm'; // Asegúrate de importar 'initORM'

const app = express();

app.use(express.json());

const startServer = async () => {
  try {
    const ormInstance = await initORM(); // Esperamos que ORM se inicie correctamente
    console.log('Base de datos conectada');
    
    // Ahora, puedes usar ormInstance para acceder a la base de datos
    
    app.listen(3000, () => {
      console.log('Servidor en el puerto 3000');
    });
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
  }
};

startServer();
