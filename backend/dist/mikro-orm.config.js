"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("@mikro-orm/mysql");
const Usuario_1 = require("./entities/Usuario");
const Camiseta_1 = require("./entities/Camiseta");
const Subasta_1 = require("./entities/Subasta");
const Oferta_1 = require("./entities/Oferta");
const Compra_1 = require("./entities/Compra");
const CompraItem_1 = require("./entities/CompraItem");
const MetodoPago_1 = require("./entities/MetodoPago");
const Pago_1 = require("./entities/Pago");
const Categoria_1 = require("./entities/Categoria");
const Descuento_1 = require("./entities/Descuento");
exports.default = (0, mysql_1.defineConfig)({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    dbName: process.env.DB_NAME || 'tienda_retro',
    entities: [
        Usuario_1.Usuario,
        Camiseta_1.Camiseta,
        Subasta_1.Subasta,
        Oferta_1.Oferta,
        Compra_1.Compra,
        CompraItem_1.CompraItem,
        MetodoPago_1.MetodoPago,
        Pago_1.Pago,
        Categoria_1.Categoria,
        Descuento_1.Descuento
    ],
    discovery: {
        warnWhenNoEntities: false,
    },
    debug: process.env.NODE_ENV !== 'production',
});
