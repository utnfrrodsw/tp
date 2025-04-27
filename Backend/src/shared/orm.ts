// src/shared/orm.ts (o cualquier archivo que tengas para esta lógica)
import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../mikro-orm.config';  // Asegúrate de que la ruta sea correcta

export const initORM = async () => {
  const ormInstance = await MikroORM.init(mikroOrmConfig);
  return ormInstance;  // Retorna la instancia de MikroORM
};
