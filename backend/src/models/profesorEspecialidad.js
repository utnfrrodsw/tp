const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProfesorEspecialidad = sequelize.define(
  'ProfesorEspecialidad',
  {
    dniProfesor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Profesores',
        key: 'dni'
      }
    },
    idEspecialidad: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Especialidades',
        key: 'id'
      }
    }
  },
  {
    tableName: 'ProfesorEspecialidad',
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = ProfesorEspecialidad;
