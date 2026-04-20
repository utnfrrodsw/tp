import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../mikro-orm.config';

let orm: MikroORM;

beforeAll(async () => {
  // Inicializar MikroORM para tests
  orm = await MikroORM.init({
    ...mikroOrmConfig,
    dbName: 'tpdsw_test', // Base de datos de testing
    allowGlobalContext: true
  });

  // Limpiar y crear schema
  const generator = orm.getSchemaGenerator();
  await generator.dropSchema();
  await generator.createSchema();
});

afterAll(async () => {
  // Cerrar conexión después de todos los tests
  await orm.close(true);
});

afterEach(async () => {
  // Limpiar datos entre tests
  const em = orm.em.fork();
  const connection = em.getConnection();
  
  // Obtener todas las tablas y limpiarlas
  const tables = [
    'reaccion',
    'resena',
    'rating_libro',
    'votacion_libro',
    'contenido_lista',
    'lista',
    'favorito',
    'seguimiento',
    'actividad',
    'newsletter',
    'newsletter_campaign',
    'password_reset_token',
    'libro',
    'autor',
    'categoria',
    'editorial',
    'saga',
    'usuario',
    'permiso'
  ];

  await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
  for (const table of tables) {
    await connection.execute(`TRUNCATE TABLE ${table}`);
  }
  await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
});

export { orm };
