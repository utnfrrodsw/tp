const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ROLES = ['admin', 'profesor', 'cliente'];

const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
      set(value) {
        this.setDataValue('email', String(value).trim().toLowerCase());
      }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rol: {
      type: DataTypes.ENUM(...ROLES),
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    // Se incrementa al cambiar contraseña o rol: invalida los JWT emitidos antes
    tokenVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    // Las cuentas que crea un admin arrancan con una contraseña que el admin conoce (por ej. el DNI).
    // No bloquea nada: el frontend lo usa para recordarle al usuario que elija la suya
    debeCambiarPassword: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    dniProfesor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
      references: {
        model: 'Profesores',
        key: 'dni'
      }
    }
  },
  {
    tableName: 'Usuarios',
    freezeTableName: true,
    defaultScope: {
      attributes: { exclude: ['passwordHash'] }
    },
    validate: {
      profesorVinculado() {
        if (this.rol === 'profesor' && !this.dniProfesor) {
          throw new Error('Un usuario con rol profesor debe tener dniProfesor');
        }
        if (this.rol !== 'profesor' && this.dniProfesor) {
          throw new Error('dniProfesor solo aplica a usuarios con rol profesor');
        }
      }
    }
  }
);

// Nunca exponer el hash ni la versión del token en una respuesta, aunque se hayan cargado
Usuario.prototype.toJSON = function () {
  const { passwordHash, tokenVersion, ...datos } = this.get();
  return datos;
};

Usuario.ROLES = ROLES;

module.exports = Usuario;
