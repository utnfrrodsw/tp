// Esquema tal como estaba antes de empezar a usar migraciones (lo que creaba sequelize.sync()).
// createTable usa CREATE TABLE IF NOT EXISTS: en una base que ya tiene las tablas no hace nada,
// y en una base vacía las crea. No modificar: los cambios nuevos van en migraciones nuevas.
const { DataTypes } = require('sequelize');

const timestamps = {
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
};

const fk = (model, key, onDelete, onUpdate = 'CASCADE') => ({
  references: { model, key },
  onUpdate,
  onDelete
});

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('Profesores', {
      dni: { type: DataTypes.INTEGER, primaryKey: true },
      nombre: { type: DataTypes.STRING, allowNull: false },
      apellido: { type: DataTypes.STRING, allowNull: false },
      telefono: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      ...timestamps
    });

    await queryInterface.createTable('Especialidades', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: DataTypes.STRING, allowNull: false },
      ...timestamps
    });

    await queryInterface.createTable('ProfesorEspecialidad', {
      dniProfesor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        ...fk('Profesores', 'dni', 'CASCADE')
      },
      idEspecialidad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        ...fk('Especialidades', 'id', 'CASCADE')
      }
    });

    await queryInterface.createTable('Usuarios', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING, allowNull: false },
      rol: { type: DataTypes.ENUM('admin', 'profesor', 'cliente'), allowNull: false },
      activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      tokenVersion: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      debeCambiarPassword: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      dniProfesor: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
        ...fk('Profesores', 'dni', 'RESTRICT')
      },
      ...timestamps
    });

    await queryInterface.createTable('clientes', {
      dni: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
      nombre: { type: DataTypes.STRING(100), allowNull: false },
      apellido: { type: DataTypes.STRING(100), allowNull: false },
      telefono: { type: DataTypes.STRING(30), allowNull: true },
      email: { type: DataTypes.STRING(100), allowNull: true },
      estado: { type: DataTypes.BOOLEAN, defaultValue: true },
      idUsuario: { type: DataTypes.INTEGER, allowNull: true, ...fk('Usuarios', 'id', 'SET NULL') },
      ...timestamps
    });

    await queryInterface.createTable('Rutinas', {
      idRutina: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      nombreRutina: { type: DataTypes.TEXT, allowNull: false },
      diaSemana: { type: DataTypes.TEXT, allowNull: true },
      // Igual que en producción: no deja borrar un cliente o profesor que tenga rutinas
      dniCliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        ...fk('clientes', 'dni', 'NO ACTION', 'NO ACTION')
      },
      dniProfesor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        ...fk('Profesores', 'dni', 'NO ACTION', 'NO ACTION')
      },
      ...timestamps
    });

    await queryInterface.createTable('RutinaEjercicios', {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      idRutina: {
        type: DataTypes.BIGINT,
        allowNull: false,
        ...fk('Rutinas', 'idRutina', 'CASCADE')
      },
      nombreEjercicio: { type: DataTypes.TEXT, allowNull: false },
      series: { type: DataTypes.INTEGER, allowNull: false },
      repeticiones: { type: DataTypes.TEXT, allowNull: false },
      descanso: { type: DataTypes.SMALLINT, allowNull: true, defaultValue: 60 },
      ...timestamps
    });
  },

  // Revertirla borraría todas las tablas con sus datos: se bloquea a propósito
  down: async () => {
    throw new Error('El esquema inicial no se revierte. Para empezar de cero, borrá la base.');
  }
};
