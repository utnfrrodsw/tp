const { Sequelize } = require('sequelize');

module.exports= new Sequelize('ttads', 'root', 'password', {
  host: 'localhost',
  dialect: 'mariadb'
});