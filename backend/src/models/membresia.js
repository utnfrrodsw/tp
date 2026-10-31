const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// El estado (activa, por vencer, vencida...) no se guarda: se calcula con las fechas
const Membresia = sequelize.define(
  'Membresia',
  {
    idMembresia: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    dniCliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'dni'
      }
    },
    fechaPago: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fechaInicio: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fechaVencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  },
  {
    tableName: 'Membresias',
    freezeTableName: true,
    timestamps: true
  }
);

module.exports = Membresia;
