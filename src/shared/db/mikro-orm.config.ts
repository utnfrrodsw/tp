import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Usuario } from '../../entities/usuario.entity';

const config: Options<PostgreSqlDriver> = {
  entities: [Usuario],
  dbName: 'your-database-name',
  user: 'your-database-user',
  password: 'your-database-password',
  driver: PostgreSqlDriver, 
};

export default config;
