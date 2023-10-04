module.exports = (sequelize, DataTypes) => {
  const alias = "Solicitud";
  const cols = {
    idSolicitud: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    fechaHora: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fotos: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    idDireccion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idCliente: {
      type: DataTypes.INTEGER,
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
      as: "cliente",
      foreignKey: "idCliente"
    })
    Solicitud.belongsTo(models.Direccion, {
      as: "direccion",
      foreignKey: "idDireccion"
    })
  }

  return Solicitud;
}
