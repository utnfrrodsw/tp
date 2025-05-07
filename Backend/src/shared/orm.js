"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initORM = void 0;
// src/shared/orm.ts
const core_1 = require("@mikro-orm/core");
const mysql_1 = require("@mikro-orm/mysql");
const usuario_entity_1 = require("../entities/usuario.entity"); // Ruta correcta a las entidades
const initORM = async () => {
    const ormInstance = await core_1.MikroORM.init({
        entities: [usuario_entity_1.Usuario],
        dbName: 'tu_base_de_datos', // Asegúrate de tener el nombre correcto de la base de datos
        user: 'root', // Cambia por tu usuario de la base de datos
        password: 'tu_contraseña', // Cambia por tu contraseña
        host: 'localhost',
        port: 3306, // Puerto de MySQL
        driver: mysql_1.MySqlDriver, // Usamos MySQLDriver en lugar de PostgreSqlDriver
    });
    return ormInstance; // Retornamos la instancia del ORM
};
exports.initORM = initORM;
