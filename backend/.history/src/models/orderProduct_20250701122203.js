const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderProduct = sequelize.define('OrderProduct', {
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
  price_at_purchase: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
}, {
  tableName: 'order_products',
  timestamps: false,
});

module.exports = OrderProduct;

