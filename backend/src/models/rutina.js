const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rutina = sequelize.define(
  'Rutina',
  {
    idRutina: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    nombreRutina: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    diaSemana: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dniCliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
       model: 'clientes',
        key: 'dni'
      }
    },
    dniProfesor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Profesores',
        key: 'dni'
      }
    }
  },
  {
    tableName: 'Rutinas',
    freezeTableName: true,
    timestamps: true
  }
);

module.exports = Rutina;
