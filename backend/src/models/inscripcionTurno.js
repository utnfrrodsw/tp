const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InscripcionTurno = sequelize.define(
  'InscripcionTurno',
  {
    idInscripcion: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'idInscripcion'
    },
    idTurno: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: { tableName: 'Turnos', schema: 'public' },
        key: 'idTurno'
      },
      field: 'idTurno'
    },
    dniCliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: { tableName: 'clientes', schema: 'public' },
        key: 'dni'
      },
      field: 'dniCliente'
    },
    fechaHoraInscripcion: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'fechaHoraInscripcion'
    },
    estado: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'estado'
    }
  },
  {
    tableName: 'InscripcionTUrno',
    freezeTableName: true,
    schema: 'public',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
);

module.exports = InscripcionTurno;
