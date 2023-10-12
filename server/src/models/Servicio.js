module.exports = (sequelize, DataTypes) => {
    const Servicio = sequelize.define('Servicio', {
      idAnuncio: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idPrestador: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fechaHora: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      costoTotal: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    }, {
      tableName: 'servicio',
      timestamps: false,
    });
  
    Servicio.associate = function (models) {
      //  relación con la tabla Presupuesto
      Servicio.belongsTo(models.Presupuesto, {
        foreignKey: {
          name: 'idAnuncio',
          allowNull: false,
        },
        targetKey: 'idAnuncio',
        as: 'presupuesto',
      });
  
      Servicio.belongsTo(models.Presupuesto, {
        foreignKey: {
          name: 'idPrestador',
          allowNull: false,
        },
        targetKey: 'idPrestador',
        as: 'presupuestoPrestador',
      });
    };
  
    return Servicio;
  };
  