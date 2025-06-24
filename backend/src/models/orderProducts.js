const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const OrderProducts = sequelize.define('OrderProducts', {
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'orders',
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'products',
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  price_at_purchase: { //lo agregamos o no ? solo tiene sentido si hacemos el historico de precios
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'order_products',
  timestamps: false,
});



module.exports = OrderProducts;
