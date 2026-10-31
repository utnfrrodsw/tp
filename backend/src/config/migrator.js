const path = require('path');
const { Umzug, SequelizeStorage } = require('umzug');
const sequelize = require('./database');

// Las migraciones aplicadas se registran en la tabla SequelizeMeta: cada una corre una sola vez
const migrator = new Umzug({
  migrations: { glob: ['migrations/*.js', { cwd: path.join(__dirname, '..', '..') }] },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console
});

module.exports = migrator;
