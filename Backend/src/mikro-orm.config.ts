// src/mikro-orm.config.ts
import { defineConfig } from '@mikro-orm/postgresql';
import { Usuario } from './entities/usuario.entity'; // Ajusta la ruta si es necesario

export default defineConfig({
  entities: [Usuario],  // Asegúrate de que Usuario esté incluido aquí
  dbName: 'your-database-name',  // El nombre de tu base de datos
  user: 'libro',    // El usuario de la base de datos
  password: '123456789',  // La contraseña de la base de datos
  host: 'localhost',   // O la dirección de tu servidor de base de datos
  port: 5432,  // El puerto por defecto de PostgreSQL
});
