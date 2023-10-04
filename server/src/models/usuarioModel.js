const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const User = sequelize.define('User', {
    idUser: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isPrestador: {
      type: DataTypes.TINYINT,// 0 CLIENTE, 1 PRESTADOR
      allowNull: false,
      defaultValue: 0, 
    },
  }, {
    tableName: 'user',
    timestamps: false,
  });

module.exports = User;

