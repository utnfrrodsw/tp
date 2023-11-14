module.exports = (sequelize, DataTypes) => {
    const Presupuesto = sequelize.define('Presupuesto', {
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
      materiales:{
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      costoMateriales: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      costoXHora: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      tiempoAprox: {
        type: DataTypes.INTEGER,
      },
    }, {
      tableName: 'presupuesto',
      timestamps: false,
    });
  
    Presupuesto.associate = function (models) {
      // Relación con la tabla Solicitud
      Presupuesto.belongsTo(models.Solicitud, {
        foreignKey:  'idSolicitud',
        as: 'anuncio',
      });
  
      // Relación con la tabla Usuario
      Presupuesto.belongsTo(models.Usuario, {
        foreignKey: 'idUsuario',
        as: 'usuario',
      });
  
      // Relación hasMany con la tabla HorariosPresupuesto
      Presupuesto.hasMany(models.HorariosPresupuesto, {
        foreignKey: 'idSolicitud',
        otherKey: 'idUsuario',
        otherKey: 'horario',
        as: 'horariosPresupuesto',  
      });
  
      // Relación hasMany con la tabla Servicio
      Presupuesto.hasMany(models.Servicio, {
        foreignKey:'idSolicitud',
        otherKey:'idUsuario',
        as: 'presupuesto',
      });
    };
  
    return Presupuesto;
  };
  