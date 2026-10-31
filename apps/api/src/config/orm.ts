import { MikroORM } from '@mikro-orm/postgresql';
import mikroOrmConfig from './mikro-orm.config.js';

let orm: MikroORM | undefined;

// Inicializa la conexión a la base de datos (solo una vez)
export async function initOrm(): Promise<MikroORM> {
  if (orm) return orm;
  orm = await MikroORM.init(mikroOrmConfig);
  return orm;
}

export function setOrm(instance: MikroORM) {
  orm = instance; // Asigno la instancia de MikroORM a la variable global
}

export function getOrm(): MikroORM {
  if (!orm) throw new Error('El ORM todavía no está inicializado');
  return orm;
}

