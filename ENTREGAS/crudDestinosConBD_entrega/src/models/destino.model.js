const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Destino = sequelize.define('Destino', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pais: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'destinos',
  timestamps: false,
});

module.exports = Destino;
