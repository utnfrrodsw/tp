
module.exports = (sequelize, DataTypes) => {
  const alias = "Anuncio";
  const cols = {
    id_anuncio: {
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
    id_direccion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }
  const config = {
    tableName: "anuncio",
    timestamps: false,
  }

  const Anuncio = sequelize.define(alias, cols, config);

  Anuncio.associate = function(models){
    Anuncio.belongsTo(models.Direccion, {
      as: "usuario",
      foreignKey: "id_usuario"
    })
    Anuncio.belongsTo(models.Direccion, {
      as: "direccion",
      foreignKey: "id_direccion"
    })
  }

  return Anuncio;
}
