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
    provincia: {
      type: dataTypes.STRING(45),
      allowNull: false,
    },
  }
  const config = {
    tableName: "localidad",
    timestamps: false,
  }

  const Localidad = sequelize.define(alias, cols, config);

  Localidad.associate = function(models){
    Localidad.hasMany(models.Direccion, {
      as: "direcciones",
      foreignKey: "codPostal"
    })
  }
  return Localidad;
}