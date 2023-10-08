module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('groups', {
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  return Group
}
