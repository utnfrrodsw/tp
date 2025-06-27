import { defineConfig } from '@mikro-orm/mysql';
import { Usuario } from '../entities/usuario.entity';
import { Autor } from '../entities/autor.entity';
import { Editorial } from '../entities/editorial.entity';
import { Libro } from '../entities/libro.entity';
import { Resena } from '../entities/resena.entity';
import { Categoria } from '../entities/categoria.entity';

export default defineConfig({
  host: 'localhost',
  port: 3306,
  user: 'joaquina',
  password: 'Utenianos2025',
  dbName: 'agencia_personal',
  entities: [Usuario, Autor, Categoria, Editorial, Libro, Resena],
  forceEntityConstructor: true,
  debug: true,
  migrations: {
    path: './src/migrations',  // carpeta donde se guardan migraciones
    pattern: /^[\w-]+\d+\.ts$/, // patrón para archivos migración
  },
});
