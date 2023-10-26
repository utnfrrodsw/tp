module.exports = (sequelize, dataTypes) => {
  const alias = "Solicitud";
  const cols = {
    idSolicitud: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    fechaHora: {
      type: dataTypes.DATE,
      allowNull: false,
    },
    titulo: {
      type: dataTypes.STRING(45),
      allowNull: false,
    },
    descripcion: {
      type: dataTypes.STRING(255),
    },
    estado: {
      type: dataTypes.STRING(20),
      allowNull: false,
    },
    idDireccion: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
    idProfesion: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
  }
  
  const config = {
    tableName: "solicitud",
    timestamps: false,
  }

  const Solicitud = sequelize.define(alias, cols, config);

  Solicitud.associate = function (models) {
    Solicitud.belongsTo(models.Direccion, {
      as: 'direccion',
      foreignKey: 'idDireccion', // Clave foránea en Solicitud
    });
    Solicitud.hasMany(models.FotoSolicitud, {
      as: 'fotosSolicitud',
      foreignKey: 'idSolicitud', // Clave foránea en FotoSolicitud
    });
    Solicitud.belongsTo(models.Profesion, {
      as: 'profesiones',
      foreignKey: 'idProfesion', // Clave foránea en Solicitud
    });
  };
  return Solicitud;
}
