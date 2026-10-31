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
        model: 'Turnos',
        key: 'idTurno'
      },
      field: 'idTurno'
    },
    dniCliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clientes',
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
    tableName: 'InscripcionTurno',
    freezeTableName: true
  }
);

module.exports = InscripcionTurno;
