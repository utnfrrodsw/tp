const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoClase = sequelize.define(
  'TipoClase',
  {
    idClase: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'idClase'
    },
    nombre: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'nombre'
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'descripcion'
    }
  },
  {
    tableName: 'TiposClase',
    freezeTableName: true,
    schema: 'public',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
);

module.exports = TipoClase;
