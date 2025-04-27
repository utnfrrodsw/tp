// src/shared/db/orm.ts
import { MikroORM } from '@mikro-orm/core';
import { Usuario } from '../entities/usuario.entity'; // Asegúrate de que esta ruta sea correcta
import { PostgreSqlDriver } from '@mikro-orm/postgresql'; // Importa el driver de PostgreSQL
export const initORM = async () => {
    const ormInstance = await MikroORM.init({
        entities: [Usuario], // Asegúrate de que Usuario esté incluido aquí
        dbName: 'your-database-name', // Asegúrate de que el nombre de la base de datos esté bien configurado
        driver: PostgreSqlDriver, // Usa el controlador PostgreSqlDriver en lugar de 'postgresql'
        user: 'your-database-user', // Usuario de la base de datos
        password: 'your-database-password', // Contraseña de la base de datos
    });
    return ormInstance; // Retornamos la instancia de ORM
};
