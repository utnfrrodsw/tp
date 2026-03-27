module.exports = (sequelize, DataTypes) => {
    const HorariosPresupuesto = sequelize.define('HorariosPresupuesto', {
      idSolicitud: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      idUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      horario: {
        type: DataTypes.DATE,
        primaryKey: true,
        allowNull: false,
      },
    }, {
      tableName: 'horariospresupuesto',
      timestamps: false,
    });
  
    HorariosPresupuesto.associate = function (models) {
      // relación con la tabla Presupuesto
      HorariosPresupuesto.belongsTo(models.Presupuesto, {
        foreignKey: 'idUsuario',
        otherKey: 'idSolicitud',
        otherKey: 'horario',
        as: 'presupuestoPrestador',
      });
    };
  
    return HorariosPresupuesto;
  };
  