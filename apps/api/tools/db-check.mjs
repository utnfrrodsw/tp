// Diagnóstico de conexión: usa la misma configuración que la API.
import { initOrm } from '../dist/config/orm.js';
import { connectionInfo } from '../dist/config/mikro-orm.config.js';

const show = (label, value) => console.log(`\n== ${label} ==\n`, value);

show('Configuración detectada', connectionInfo);

try {
  const orm = await initOrm();
  const conn = orm.em.getConnection();

  show('Identidad', await conn.execute('select current_user, current_database(), version()'));

  const tablas = await conn.execute(
    "select table_name from information_schema.tables where table_schema = 'public' order by 1"
  );
  show('Tablas en public', tablas.map((t) => t.table_name));

  show('Usuarios', await conn.execute('select count(*)::int as total from usuarios'));

  await orm.close();
  console.log('\nDiagnóstico completo sin errores.');
} catch (error) {
  console.error('\nFALLÓ:', error.message);
  if (error.code) console.error('Código Postgres:', error.code);
  if (error.cause) console.error('Causa:', error.cause.message ?? error.cause);
  process.exitCode = 1;
}
