module.exports = (sequelize, DataTypes) => {
  const Technician = sequelize.define('technicians', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_born: {
      type: DataTypes.DATE,
      allowNull: false
    }
  })

  return Technician
}
