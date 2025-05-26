const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, sent, delivered
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
}, { timestamps: true });

Order.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = Order;
