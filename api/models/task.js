module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('tasks', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  return Task
}
