module.exports = (sequelize, DataTypes) => {
  const GroupTechnician = sequelize.define('groups_technicians', {
    date_assigned: {
      type: DataTypes.DATE,
      allowNull: false
    },
    date_end: {
      type: DataTypes.DATE,
      allowNull: true
    }
  })

  return GroupTechnician
}
