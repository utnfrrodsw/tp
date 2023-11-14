module.exports = (sequelize, DataTypes) => {
    const SolicitudProfesiones = sequelize.define('SolicitudProfesiones', {
      idSolicitud: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idProfesion: { // Cambiado de idprofesiones a idProfesion
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      tableName: 'solicitud_profesiones',
      timestamps: false,
    });
  
    SolicitudProfesiones.associate = function (models) {
      // Relación "belongsTo" con la tabla Profesion
      SolicitudProfesiones.belongsTo(models.Profesion, {
        foreignKey: 'idProfesion',  
        as: 'profesion',
      });
  
      // Agrega la relación "belongsTo" con la tabla Solicitud
      SolicitudProfesiones.belongsTo(models.Solicitud, {
        foreignKey: 'idSolicitud',
        as: 'solicitud',
      });
    };
  
    return SolicitudProfesiones;
  };
  