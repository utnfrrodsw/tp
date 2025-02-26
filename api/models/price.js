module.exports = (sequelize, DataTypes) => {
  const Price = sequelize.define('prices', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })

  return Price
}
