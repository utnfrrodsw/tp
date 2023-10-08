module.exports = (sequelize, dataTypes) => {
  const alias = 'Usuario';
  const cols = {
    idUsuario: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre: {
      type: dataTypes.STRING(40),
      allowNull: false,
    },
    apellido: {
      type: dataTypes.STRING(40),
      allowNull: false,
    },
    email: {
      type: dataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    contrasena: {
      type: dataTypes.STRING(32),
      allowNull: false,
    },
    fechaNacimiento: {
      type: dataTypes.DATE,
      allowNull: true,
    },
    telefono: {
      type: dataTypes.INTEGER,
      allowNull: true,
    },
    esPrestador: {
      type: dataTypes.TINYINT,// 0 CLIENTE, 1 PRESTADOR
      allowNull: false,
      defaultValue: 0, 
    },
  }
  const config = {
    tableName: 'usuario',
    timestamps: false,
  };
  const Usuario = sequelize.define(alias, cols, config);
  Usuario.associate = function (models) {
    // Un usuario puede tener varias direcciones
    Usuario.hasMany(models.Direccion, {
      as: 'direcciones',
      foreignKey: 'idUsuario', // Clave foránea en Direccion
    });
  };
  return Usuario;
};

