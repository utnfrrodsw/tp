const Profesor = require('./profesor');
const Especialidad = require('./especialidad');
const ProfesorEspecialidad = require('./profesorEspecialidad');
const Usuario = require('./usuario');
const Rutina = require('./rutina');
const RutinaEjercicio = require('./rutinaEjercicio');
const Cliente = require('./Cliente');
const Membresia = require('./membresia');
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
  as: 'profesores',
  onDelete: 'RESTRICT'
});

// RESTRICT: no se puede borrar un profesor que tiene cuenta de usuario
Usuario.belongsTo(Profesor, { foreignKey: 'dniProfesor', as: 'profesor', onDelete: 'RESTRICT' });
Profesor.hasOne(Usuario, { foreignKey: 'dniProfesor', as: 'usuario', onDelete: 'RESTRICT' });

// Cliente <-> Usuario (1 a 1): no se puede borrar la cuenta de un cliente sin borrar al cliente
Cliente.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario', onDelete: 'RESTRICT' });
Usuario.hasOne(Cliente, { foreignKey: 'idUsuario', as: 'cliente', onDelete: 'RESTRICT' });

// Rutina <-> Profesor. NO ACTION como en la base: no se puede borrar un profesor con rutinas
// (el esquema real lo definen las migraciones; esto tiene que coincidir con ellas)
Rutina.belongsTo(Profesor, { foreignKey: 'dniProfesor', as: 'profesor', onDelete: 'NO ACTION' });
Profesor.hasMany(Rutina, { foreignKey: 'dniProfesor', as: 'rutinas' });

// Rutina <-> Cliente (Usa dniCliente como clave foránea). Al borrar un cliente se borran sus rutinas
Rutina.belongsTo(Cliente, { foreignKey: 'dniCliente', as: 'cliente', onDelete: 'CASCADE' });
Cliente.hasMany(Rutina, { foreignKey: 'dniCliente', as: 'rutinas' });

// Cliente <-> Membresia (un cliente puede tener muchas). Al borrar un cliente se borran sus membresías
Cliente.hasMany(Membresia, { foreignKey: 'dniCliente', as: 'membresias', onDelete: 'CASCADE' });
Membresia.belongsTo(Cliente, { foreignKey: 'dniCliente', as: 'cliente', onDelete: 'CASCADE' });

// Rutina <-> RutinaEjercicio
Rutina.hasMany(RutinaEjercicio, {
  foreignKey: 'idRutina',
  as: 'ejercicios',
  onDelete: 'CASCADE'
});
RutinaEjercicio.belongsTo(Rutina, { foreignKey: 'idRutina', as: 'rutina' });

// Tipos de clase <-> turnos
// RESTRICT: no se puede borrar un tipo de clase que tiene turnos
TipoClase.hasMany(Turno, { foreignKey: 'idClase', as: 'turnos', onDelete: 'RESTRICT' });
Turno.belongsTo(TipoClase, { foreignKey: 'idClase', as: 'tipoClase', onDelete: 'RESTRICT' });

// Turnos <-> profesores asignados (un profesor con turnos asignados no se puede borrar)
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
  as: 'turnos',
  onDelete: 'RESTRICT'
});
Turno.hasMany(TurnoProfesor, {
  foreignKey: 'idTurno',
  as: 'asignacionesProfesor',
  onDelete: 'CASCADE'
});
TurnoProfesor.belongsTo(Turno, { foreignKey: 'idTurno', as: 'turno' });

// Turnos <-> inscripciones de clientes. Al borrar un cliente se borran sus inscripciones
// RESTRICT: no se puede borrar un turno con inscripciones
Turno.hasMany(InscripcionTurno, {
  foreignKey: 'idTurno',
  as: 'inscripciones',
  onDelete: 'RESTRICT'
});
InscripcionTurno.belongsTo(Turno, { foreignKey: 'idTurno', as: 'turno', onDelete: 'RESTRICT' });
InscripcionTurno.belongsTo(Cliente, {
  foreignKey: 'dniCliente',
  as: 'cliente',
  onDelete: 'CASCADE'
});
Cliente.hasMany(InscripcionTurno, {
  foreignKey: 'dniCliente',
  as: 'inscripcionesTurno',
  onDelete: 'CASCADE'
});

module.exports = {
  Profesor,
  Especialidad,
  ProfesorEspecialidad,
  Usuario,
  Rutina,
  RutinaEjercicio,
  Cliente,
  Membresia,
  TipoClase,
  Turno,
  TurnoProfesor,
  InscripcionTurno
};
