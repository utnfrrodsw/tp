const { Sequelize } = require('sequelize');
const { types } = require('pg');
require('dotenv').config();

types.setTypeParser(types.builtins.INT8, (value) => Number(value));

// En los tests se usa SQLite en memoria: nunca se toca la base real aunque el .env tenga DATABASE_URL
const sequelize =
  process.env.NODE_ENV === 'test'
    ? new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false })
    : process.env.DATABASE_URL
      ? new Sequelize(process.env.DATABASE_URL, {
          dialect: 'postgres',
          protocol: 'postgres',
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
          }
        })
      : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || 5432,
          dialect: 'postgres'
        });

module.exports = sequelize;
