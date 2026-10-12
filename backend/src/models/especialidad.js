const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Especialidad = sequelize.define(
  'Especialidad',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'Especialidades',
    freezeTableName: true
  }
);

module.exports = Especialidad;
