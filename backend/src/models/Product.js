const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  //code: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.TEXT },
  image: { type: DataTypes.STRING },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { timestamps: false });



module.exports = Product;
