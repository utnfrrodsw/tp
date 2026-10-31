const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define(
  'Cliente',
  {
    dni: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    // Es también el usuario con el que entra a la app
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    // Todo cliente tiene una cuenta para entrar a la app, y una cuenta pertenece a un solo cliente
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: 'clientes',
    timestamps: true
  }
);

module.exports = Cliente;
