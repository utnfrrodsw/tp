const db = require('../models');
const Token = require('../models/token.js');
const { getUserInfo } = require('../lib/getUserInfo');


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
      unique: false,
    },
    contrasena: {
      type: dataTypes.STRING(250),
      allowNull: false,
    },
    fechaNacimiento: {
      type: dataTypes.DATE,
      allowNull: false,
    },
    telefono: {
      type: dataTypes.STRING(20),
      allowNull: false,
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
    Usuario.hasMany(models.PrestadorProfesiones, {
      as: 'profesiones',
      foreignKey: 'idprestador', // Clave foránea en PrestadorProfesiones
    });
    Usuario.hasMany(models.HistoricoResenia, {
      as: 'resenias',
      foreignKey: 'idUsuario', // Clave foránea en HistoricoResenia
    });
    Usuario.hasMany(models.Presupuesto, {
      as: 'presupuestos',
      foreignKey: 'idUsuario', // Clave foránea en Presupuesto
    });
  };
  
  return Usuario;
};



