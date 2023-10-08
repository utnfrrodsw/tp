module.exports = (sequelize, DataTypes) => {
  const Price = sequelize.define('prices', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    date_from: {
      type: DataTypes.DATE,
      primaryKey: true,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })

  return Price
}
