// src/shared/orm.ts
import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { Usuario } from '../entities/usuario.entity'; // Ruta correcta a las entidades

export const initORM = async () => {
  const ormInstance = await MikroORM.init<MySqlDriver>({
    entities: [Usuario],
    dbName: 'tu_base_de_datos', // Asegúrate de tener el nombre correcto de la base de datos
    user: 'root', // Cambia por tu usuario de la base de datos
    password: 'tu_contraseña', // Cambia por tu contraseña
    host: 'localhost',
    port: 3306, // Puerto de MySQL
    driver: MySqlDriver, // Usamos MySQLDriver en lugar de PostgreSqlDriver
  });
  
  return ormInstance; // Retornamos la instancia del ORM
};
