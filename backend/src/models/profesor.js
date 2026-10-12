const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profesor = sequelize.define(
  'Profesor',
  {
    dni: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'Profesores',
    freezeTableName: true
  }
);

module.exports = Profesor;
