const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Turno = sequelize.define(
  'Turno',
  {
    idTurno: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'idTurno'
    },
    idClase: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: { tableName: 'TiposClase', schema: 'public' },
        key: 'idClase'
      },
      field: 'idClase'
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'fecha'
    },
    horaInicio: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'horaInicio'
    },
    horaFin: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'horaFin'
    },
    capacidadMaxima: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'capacidadMaxima'
    },
    estado: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'estado'
    }
  },
  {
    tableName: 'Turnos',
    freezeTableName: true,
    schema: 'public',
    createdAt: 'createdAT',
    updatedAt: 'updatedAT'
  }
);

module.exports = Turno;
