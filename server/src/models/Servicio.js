module.exports = (sequelize, DataTypes) => {
    const Servicio = sequelize.define('Servicio', {
      idSolicitud: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      fechaHora: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      estado: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      resenia: {
        type: DataTypes.INTEGER,
      },
    }, {
      tableName: 'servicio',
      timestamps: false,
    });
  
    Servicio.associate = function (models) {
      //  relación con la tabla Presupuesto
      Servicio.belongsTo(models.Presupuesto, {
        foreignKey:'idSolicitud',
        otherKey:'idUsuario',
        as: 'presupuesto',
      });
    };
  
    return Servicio;
  };
  