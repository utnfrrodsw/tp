module.exports = (sequelize, DataTypes) => {
    const HorariosPresupuesto = sequelize.define('HorariosPresupuesto', {
      idSolicitud: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idPrestador: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      horario: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    }, {
      tableName: 'horariospresupuesto',
      timestamps: false,
    });
  
    HorariosPresupuesto.associate = function (models) {
      // relación con la tabla Presupuesto
      HorariosPresupuesto.belongsTo(models.Presupuesto, {
        foreignKey:  'idSolicitud',
        as: 'presupuesto',
      });
  
      HorariosPresupuesto.belongsTo(models.Presupuesto, {
        foreignKey: 'idPrestador',
        as: 'presupuestoPrestador',
      });
    };
  
    return HorariosPresupuesto;
  };
  