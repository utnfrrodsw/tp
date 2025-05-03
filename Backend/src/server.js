import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './shared/mikro-orm.config';
import app from './app'; // 👈 importante: export default en app.ts
const startServer = async () => {
    try {
        const orm = await MikroORM.init(mikroOrmConfig);
        app.set('orm', orm); // 👈 importante: pasar instancia a req.app
        console.log('📦 Conectado a MySQL');
        app.listen(3000, () => {
            console.log('🚀 Servidor en puerto 3000');
        });
    }
    catch (err) {
        console.error('❌ Error al conectar a la base de datos:', err);
    }
};
startServer();
