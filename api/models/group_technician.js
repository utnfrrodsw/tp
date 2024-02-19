module.exports = (sequelize, DataTypes) => {
  const GroupTechnician = sequelize.define('groups_technicians', {
    groupId : {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    date_assigned: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true
    },
    technicianId : {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    date_end: {
      type: DataTypes.DATE,
      allowNull: true
    }
  })

  return GroupTechnician
}
