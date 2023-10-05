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
    fotos: {
      type: dataTypes.BLOB,
      allowNull: false,
    },
    idCliente: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
    idDireccion: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
  }
  const config = {
    tableName: "Solicitud",
    timestamps: false,
  }

  const Solicitud = sequelize.define(alias, cols, config);

  Solicitud.associate = function(models){
    Solicitud.belongsTo(models.Direccion, {
      as: "fk_solicitud_cliente",
      foreignKey: "idCliente"
    })
    Solicitud.belongsTo(models.Direccion, {
      as: "fk_solicitud_direccion",
      foreignKey: "idDireccion"
    })
  }

  return Solicitud;
}
