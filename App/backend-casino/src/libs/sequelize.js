const { Sequelize } = require('sequelize');

const { config } = require('../config/config');
const setupModels = require('./../db/models');

const sequelize = new Sequelize(
    config.dbName,
    config.dbUser,
    config.dbPassword,
    {
        host: config.dbHost,
        dialect: 'mysql',
        timezone: "-03:00"
    }
    
);

sequelize.sync();

setupModels(sequelize);

module.exports = sequelize;