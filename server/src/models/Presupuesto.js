module.exports = (sequelize, DataTypes) => {
    const Presupuesto = sequelize.define('Presupuesto', {
      idAnuncio: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idPrestador: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      costoMateriales: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      costoXHora: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
    }, {
      tableName: 'presupuesto',
      timestamps: false,
    });
  
    Presupuesto.associate = function (models) {
      // relación con la tabla Solicitud
      Presupuesto.belongsTo(models.Solicitud, {
        foreignKey: {
          name: 'idAnuncio',
          allowNull: false,
        },
        targetKey: 'idSolicitud',
        as: 'anuncio', 
      });
  
      //  relación con la tabla Usuario
      Presupuesto.belongsTo(models.Usuario, {
        foreignKey: {
          name: 'idPrestador',
          allowNull: false,
        },
        targetKey: 'idUsuario',
        as: 'usuario',  
      });
    };
  
    return Presupuesto;
  };
  