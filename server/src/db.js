//REALIZO LA CONEXION A LA BASE DE DATOS

const { Sequelize } = require('sequelize');
const { DB_DATABASE, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = require('./config');

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
});
module.exports = sequelize;
