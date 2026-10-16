const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TurnoProfesor = sequelize.define(
  'TurnoProfesor',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
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
    dniProfesor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: { tableName: 'Profesores', schema: 'public' },
        key: 'dni'
      },
      field: 'dniProfesor'
    }
  },
  {
    tableName: 'TurnoProfesores',
    freezeTableName: true,
    schema: 'public',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
);

module.exports = TurnoProfesor;
