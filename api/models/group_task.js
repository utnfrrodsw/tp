module.exports = (sequelize, DataTypes) => {
  const GroupTask = sequelize.define('groups_tasks', {
    date_completed: {
      type: DataTypes.DATEONLY,
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
      allowNull: true,
      primaryKey: true,
      allowNull: false
    },
    observation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    taskId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'Task', // Nombre del modelo referenciado
        key: 'id' // Nombre de la columna referenciada
      }
    },
    groupId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'Group', // Nombre del modelo referenciado
        key: 'id' // Nombre de la columna referenciada
      }
    }
  })

  return GroupTask
}
