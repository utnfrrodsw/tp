import { Options } from '@mikro-orm/core';
import { Usuario } from '../entities/usuario.entity';
import { MySqlConnection } from '@mikro-orm/mysql';

const config: Options = {
  host: 'localhost',
  port: 3306,
  user: 'tu_usuario',
  password: 'tu_password',
  dbName: 'tu_base_de_datos',
  entities: [Usuario], // ✅ Import directo (no usar string)
};

export default config;
