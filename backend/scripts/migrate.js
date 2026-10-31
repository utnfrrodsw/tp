// Uso: pnpm run migrate            aplica las migraciones pendientes
//      pnpm run migrate:status     muestra cuáles están aplicadas y cuáles pendientes
//      pnpm run migrate:down       revierte la última
const sequelize = require('../src/config/database');
const migrator = require('../src/config/migrator');

const comandos = {
  up: () => migrator.up(),
  down: () => migrator.down(),
  status: async () => {
    const aplicadas = await migrator.executed();
    const pendientes = await migrator.pending();
    console.log('Aplicadas:', aplicadas.map((m) => m.name).join(', ') || '(ninguna)');
    console.log('Pendientes:', pendientes.map((m) => m.name).join(', ') || '(ninguna)');
  }
};

const comando = process.argv[2] ?? 'up';

if (!comandos[comando]) {
  console.error(`Comando desconocido: ${comando}. Usá up, down o status.`);
  process.exitCode = 1;
} else {
  comandos[comando]()
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    })
    .finally(() => sequelize.close());
}
