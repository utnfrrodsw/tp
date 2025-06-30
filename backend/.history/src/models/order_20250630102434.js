const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  status: { type: DataTypes.STRING, defaultValue: 'pendiente' }, // pendiente, enviado, entregado, cancelado
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  // userId: { type: DataTypes.INTEGER, allowNull: false } // agregado 
}, { timestamps: true });



module.exports = Order;
