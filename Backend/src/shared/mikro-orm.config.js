"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usuario_entity_1 = require("../entities/usuario.entity"); // Asegúrate de que la ruta de las entidades sea correcta
const config = {
    host: 'localhost',
    port: 3306,
    user: 'root', // Cambia por tu usuario
    password: 'tu_contraseña', // Cambia por tu contraseña
    dbName: 'tu_base_de_datos', // Cambia por tu base de datos
    entities: [usuario_entity_1.Usuario],
    entitiesTs: ['./src/entities'], // Soporta tus entidades TypeScript
    debug: true,
    migrations: {
        path: './migrations',
        pathTs: './src/migrations',
    },
};
exports.default = config;
