const Profesor = require('./profesor');
const Especialidad = require('./especialidad');
const ProfesorEspecialidad = require('./profesorEspecialidad');
const Usuario = require('./usuario');
const Rutina = require('./rutina');
const RutinaEjercicio = require('./rutinaEjercicio');
const Cliente = require('./Cliente');
const TipoClase = require('./tipoClase');
const Turno = require('./turno');
const TurnoProfesor = require('./turnoProfesor');
const InscripcionTurno = require('./inscripcionTurno');

// Profesor <-> Especialidad (Muchos a Muchos)
Profesor.belongsToMany(Especialidad, {
  through: ProfesorEspecialidad,
  foreignKey: 'dniProfesor',
  otherKey: 'idEspecialidad',
  as: 'especialidades'
});

Especialidad.belongsToMany(Profesor, {
  through: ProfesorEspecialidad,
  foreignKey: 'idEspecialidad',
  otherKey: 'dniProfesor',
  as: 'profesores'
});

// RESTRICT: no se puede borrar un profesor que tiene cuenta de usuario
Usuario.belongsTo(Profesor, { foreignKey: 'dniProfesor', as: 'profesor', onDelete: 'RESTRICT' });
Profesor.hasOne(Usuario, { foreignKey: 'dniProfesor', as: 'usuario', onDelete: 'RESTRICT' });

// Cliente <-> Usuario (1 a 1 opcional)
Cliente.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });
Usuario.hasOne(Cliente, { foreignKey: 'idUsuario', as: 'cliente' });

// Rutina <-> Profesor
Rutina.belongsTo(Profesor, { foreignKey: 'dniProfesor', as: 'profesor', onDelete: 'RESTRICT' });
Profesor.hasMany(Rutina, { foreignKey: 'dniProfesor', as: 'rutinas' });

// Rutina <-> Cliente (Usa dniCliente como clave foránea)
Rutina.belongsTo(Cliente, { foreignKey: 'dniCliente', as: 'cliente', onDelete: 'RESTRICT' });
Cliente.hasMany(Rutina, { foreignKey: 'dniCliente', as: 'rutinas' });

// Rutina <-> RutinaEjercicio
Rutina.hasMany(RutinaEjercicio, {
  foreignKey: 'idRutina',
  as: 'ejercicios',
  onDelete: 'CASCADE'
});
RutinaEjercicio.belongsTo(Rutina, { foreignKey: 'idRutina', as: 'rutina' });

// Tipos de clase <-> turnos
TipoClase.hasMany(Turno, { foreignKey: 'idClase', as: 'turnos' });
Turno.belongsTo(TipoClase, { foreignKey: 'idClase', as: 'tipoClase' });

// Turnos <-> profesores asignados
Turno.belongsToMany(Profesor, {
  through: TurnoProfesor,
  foreignKey: 'idTurno',
  otherKey: 'dniProfesor',
  as: 'profesores'
});
Profesor.belongsToMany(Turno, {
  through: TurnoProfesor,
  foreignKey: 'dniProfesor',
  otherKey: 'idTurno',
  as: 'turnos'
});
Turno.hasMany(TurnoProfesor, { foreignKey: 'idTurno', as: 'asignacionesProfesor' });
TurnoProfesor.belongsTo(Turno, { foreignKey: 'idTurno', as: 'turno' });

// Turnos <-> inscripciones de clientes
Turno.hasMany(InscripcionTurno, { foreignKey: 'idTurno', as: 'inscripciones' });
InscripcionTurno.belongsTo(Turno, { foreignKey: 'idTurno', as: 'turno' });
InscripcionTurno.belongsTo(Cliente, { foreignKey: 'dniCliente', as: 'cliente' });
Cliente.hasMany(InscripcionTurno, { foreignKey: 'dniCliente', as: 'inscripcionesTurno' });

module.exports = {
  Profesor,
  Especialidad,
  ProfesorEspecialidad,
  Usuario,
  Rutina,
  RutinaEjercicio,
  Cliente,
  TipoClase,
  Turno,
  TurnoProfesor,
  InscripcionTurno
};
