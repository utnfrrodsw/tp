"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./shared/mikro-orm.config"));
const app_1 = __importDefault(require("./app")); // 👈 importante: export default en app.ts
const startServer = async () => {
    try {
        const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
        app_1.default.set('orm', orm); // 👈 importante: pasar instancia a req.app
        console.log('📦 Conectado a MySQL');
        app_1.default.listen(3000, () => {
            console.log('🚀 Servidor en puerto 3000');
        });
    }
    catch (err) {
        console.error('❌ Error al conectar a la base de datos:', err);
    }
};
startServer();
