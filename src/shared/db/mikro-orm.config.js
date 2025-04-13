import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Usuario } from '../../entities/usuario.entity';
const config = {
    entities: [Usuario],
    dbName: 'your-database-name',
    user: 'your-database-user',
    password: 'your-database-password',
    driver: PostgreSqlDriver,
};
export default config;
