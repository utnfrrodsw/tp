// paso todas las relaciones aca, asi esta mas ordeinado

require('dotenv').config();
const sequelize = require('../config/db');

const User = require('./user');
const Category = require('./category');
const Product = require('./product');
const Order = require('./order');
const OrderProduct = require('./orderProduct');
const Review = require('./review');

// Relaciones User
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' }); // FALTABA ESTA

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

// Relaciones Category
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId', onDelete: 'CASCADE' });

// Relaciones Product - Review
Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId', onDelete: 'CASCADE' });

// Relaciones Order-Product (Many-to-Many) usando tabla intermedia OrderProducts
Order.belongsToMany(Product, {
  through: OrderProduct,
  foreignKey: 'orderId',
  otherKey: 'productId',
  as: 'productos' // necesario por ser una relación M:M y evitar ambigüedad
});
Product.belongsToMany(Order, {
  through: OrderProduct,
  foreignKey: 'productId',
  otherKey: 'orderId',
  as: 'pedidos' // necesario por la misma razón
});

// Relaciones con la tabla intermedia directamente
Order.hasMany(OrderProduct, { foreignKey: 'orderId' });

Product.hasMany(OrderProduct, { foreignKey: 'productId' });
OrderProducts.belongsTo(Order, { foreignKey: 'orderId' });
OrderProducts.belongsTo(Product, { foreignKey: 'productId' });



module.exports = { sequelize, User, Category, Product, Order, OrderProducts, Review };


