module.exports = (sequelize, dataTypes) => {
  const alias = "Localidad";
  const cols = {
    codPostal: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre: {
      type: dataTypes.STRING(45),
      allowNull: false,
    },
    provincio: {
      type: dataTypes.STRING(45),
      allowNull: false,
    },
  }
  const config = {
    tableName: "Localidad",
    timestamps: false,
  }

  const Localidad = sequelize.define(alias, cols, config);

  Localidad.associate = function(models){
    Localidad.hasMany(models.Direccion, {
      as: "fk_direccion_localidad",
      foreignKey: "codPostal"
    })
  }
  return Localidad;
}