// src/shared/orm.ts
import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { Usuario } from '../entities/usuario.entity';

export const initORM = async () => {
  const ormInstance = await MikroORM.init<MySqlDriver>({
    entities: [Usuario],
    dbName: 'tp_dsw304',
    user: 'root',
    password: 'Utenianos2025',
    host: 'localhost',
    port: 3306,
  });

  return ormInstance;
};
