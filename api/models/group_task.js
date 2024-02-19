module.exports = (sequelize, DataTypes) => {
  const GroupTask = sequelize.define('groups_tasks', {
    date_completed: {
      type: DataTypes.DATE,
      primaryKey: true,
      allowNull: false
    },
    conection: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    hour: {
      type: DataTypes.TIME,
      allowNull: true
    },
    observation: {
      type: DataTypes.STRING,
      allowNull: true
    }
  })

  return GroupTask
}
