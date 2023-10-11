module.exports = (sequelize, DataTypes) => {
    const HorariosPresupuesto = sequelize.define('HorariosPresupuesto', {
      idAnuncio: {
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
        foreignKey: {
          name: 'idAnuncio',
          allowNull: false,
        },
        targetKey: 'idAnuncio',
        as: 'presupuesto',
      });
  
      HorariosPresupuesto.belongsTo(models.Presupuesto, {
        foreignKey: {
          name: 'idPrestador',
          allowNull: false,
        },
        targetKey: 'idPrestador',
        as: 'presupuestoPrestador',
      });
    };
  
    return HorariosPresupuesto;
  };
  