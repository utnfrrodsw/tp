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
        model: 'Turnos',
        key: 'idTurno'
      },
      field: 'idTurno'
    },
    dniProfesor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Profesores',
        key: 'dni'
      },
      field: 'dniProfesor'
    }
  },
  {
    tableName: 'TurnoProfesores',
    freezeTableName: true
  }
);

module.exports = TurnoProfesor;
