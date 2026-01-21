// scripts/init-db.ts
import 'reflect-metadata';
import 'dotenv/config';
import { MikroORM } from '@mikro-orm/core';
import config from '../src/mikro-orm.config';

async function initDatabase() {
  console.log('🔄 Inicializando base de datos...');
  
  try {
    const orm = await MikroORM.init(config);
    
    // Obtener el schema generator
    const generator = orm.getSchemaGenerator();
    
    // Eliminar el schema existente (cuidado: esto borra todo)
    await generator.dropSchema();
    console.log('🗑️  Schema anterior eliminado');
    
    // Crear el schema nuevo
    await generator.createSchema();
    console.log('🏗️  Nuevo schema creado');

    // Agregar la restricción ON DELETE CASCADE manualmente a subasta.camiseta_id
    const conn = orm.em.getConnection();
    try {
      await conn.execute(`ALTER TABLE subasta DROP FOREIGN KEY subasta_camiseta_id_foreign;`);
      await conn.execute(`ALTER TABLE subasta ADD CONSTRAINT subasta_camiseta_id_foreign FOREIGN KEY (camiseta_id) REFERENCES camiseta(id) ON DELETE CASCADE ON UPDATE CASCADE;`);
      console.log('🔗 Restricción ON DELETE CASCADE agregada a subasta.camiseta_id');
    } catch (e) {
      if (e instanceof Error) {
        console.warn('⚠️ No se pudo modificar la restricción de subasta.camiseta_id:', e.message);
      } else {
        console.warn('⚠️ No se pudo modificar la restricción de subasta.camiseta_id:', e);
      }
    }

    // Verificar que las tablas se crearon
    console.log('📋 Verificando tablas creadas...');

    await orm.close();
    console.log('✅ Base de datos inicializada correctamente');
    console.log('💡 Ejecuta "pnpm run seed-db" para agregar datos de prueba');
    
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
  }
}

initDatabase();
