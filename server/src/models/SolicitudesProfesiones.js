module.exports = (sequelize, DataTypes) => {
    const SolicitudProfesiones = sequelize.define('SolicitudProfesiones', {
      idSolicitud: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idprofesiones: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      tableName: 'solicitud_profesiones',
      timestamps: false,
    });
  
    SolicitudProfesiones.associate = function (models) {
      //  relación con la tabla Profesion
      SolicitudProfesiones.belongsTo(models.Profesion, {
        foreignKey: 'idprofesiones',
        as: 'profesion',  
      });
    };
  
    return SolicitudProfesiones;
  };
  