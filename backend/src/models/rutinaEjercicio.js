const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RutinaEjercicio = sequelize.define(
  'RutinaEjercicio',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    idRutina: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Rutinas',
        key: 'idRutina'
      }
    },
    nombreEjercicio: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    series: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    repeticiones: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    descanso: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 60
    }
  },
  {
    tableName: 'RutinaEjercicios',
    freezeTableName: true,
    timestamps: true
  }
);

module.exports = RutinaEjercicio;
