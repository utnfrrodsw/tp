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
      // Relación con la tabla Solicitud
      Presupuesto.belongsTo(models.Solicitud, {
        foreignKey: {
          name: 'idAnuncio',
          allowNull: false,
        },
        targetKey: 'idSolicitud',
        as: 'anuncio',
      });
  
      // Relación con la tabla Usuario
      Presupuesto.belongsTo(models.Usuario, {
        foreignKey: {
          name: 'idPrestador',
          allowNull: false,
        },
        targetKey: 'idUsuario',
        as: 'usuario',
      });
  
      // Relación hasMany con la tabla HorariosPresupuesto
      Presupuesto.hasMany(models.HorariosPresupuesto, {
        foreignKey: 'idPresupuesto',
        as: 'horariosPresupuesto',  
      });
  
      // Relación hasMany con la tabla Servicio
      Presupuesto.hasMany(models.Servicio, {
        foreignKey: 'idPresupuesto', 
        as: 'servicios', 
      });
    };
  
    return Presupuesto;
  };
  