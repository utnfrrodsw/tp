

module.exports = (sequelize, DataTypes) => {
  const ResetCode = sequelize.define('ResetCode', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'reset_codes', // Nombre de la tabla en la base de datos
  });

  ResetCode.associate = (models) => {
    ResetCode.belongsTo(models.Usuario, { foreignKey: 'userId' });
  };

  return ResetCode;
};
