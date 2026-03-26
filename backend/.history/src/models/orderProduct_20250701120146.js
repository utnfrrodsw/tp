const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./order');
const Product = require('./product');

const OrderProduct = sequelize.define('OrderProduct', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false
});

// Relaciones
Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });

module.exports = OrderProduct;
