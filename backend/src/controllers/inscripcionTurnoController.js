const { Op } = require('sequelize');
const sequelize = require('../config/database');
const {
  Cliente,
  InscripcionTurno,
  Membresia,
  Turno,
  TurnoProfesor
} = require('../models/associations');
const { toPositiveInt, sendError } = require('../utils/http');
const {
  cargarClienteDeSesion,
  fechaHoraLocalAUTC,
  fechaBuenosAires,
  ESTADO_CANCELADA,
  ESTADOS_ASISTENCIA,
  estadoVigente: estadoActivoWhere
} = require('./turnoController');

const inscribirse = async (req, res) => {
  try {
    const idTurno = toPositiveInt(req.params.id);
    if (!idTurno) return res.status(400).json({ message: 'idTurno inválido' });
    const dniCliente = await cargarClienteDeSesion(req);
    if (!dniCliente)
      return res.status(403).json({ message: 'La cuenta no está asociada a un cliente' });

    const inscripcion = await sequelize.transaction(async (transaction) => {
      const turno = await Turno.findByPk(idTurno, {
        transaction,
        lock: transaction.LOCK.UPDATE
      });
      if (!turno || turno.fecha === null) {
        const error = new Error('Turno no encontrado');
        error.status = 404;
        throw error;
      }
      if (!turno.horaInicio || !turno.capacidadMaxima) {
        const error = new Error('El turno no tiene horario o capacidad configurados');
        error.status = 409;
        throw error;
      }

      const inicioUtc = fechaHoraLocalAUTC(turno.fecha, String(turno.horaInicio).slice(0, 8));
      if (!Number.isFinite(inicioUtc) || inicioUtc - Date.now() < 8 * 60 * 60 * 1000) {
        const error = new Error(
          'La inscripción debe realizarse con al menos 8 horas de anticipación'
        );
        error.status = 409;
        throw error;
      }

      const cliente = await Cliente.findByPk(dniCliente, {
        transaction,
        lock: transaction.LOCK.UPDATE
      });
      if (!cliente) {
        const error = new Error('Cliente no encontrado');
        error.status = 404;
        throw error;
      }

      // Para reservar hace falta una membresía que cubra el día del turno
      const cubreElTurno = await Membresia.count({
        where: {
          dniCliente,
          fechaInicio: { [Op.lte]: turno.fecha },
          fechaVencimiento: { [Op.gte]: turno.fecha }
        },
        transaction
      });
      if (!cubreElTurno) {
        const alDia = await Membresia.count({
          where: { dniCliente, fechaVencimiento: { [Op.gte]: fechaBuenosAires() } },
          transaction
        });
        const error = new Error(
          alDia
            ? 'Tu membresía no cubre el día de este turno'
            : 'Necesitás una membresía vigente para reservar'
        );
        error.status = 409;
        throw error;
      }

      const existenteEnEsteTurno = await InscripcionTurno.findOne({
        where: { idTurno, dniCliente, ...estadoActivoWhere },
        transaction
      });
      if (existenteEnEsteTurno) {
        const error = new Error('Ya estás inscripto en este turno');
        error.status = 409;
        throw error;
      }

      const inscripcionEseDia = await InscripcionTurno.findOne({
        where: { dniCliente, ...estadoActivoWhere },
        include: [
          {
            model: Turno,
            as: 'turno',
            where: { fecha: turno.fecha },
            attributes: ['idTurno'],
            required: true
          }
        ],
        transaction
      });
      if (inscripcionEseDia) {
        const error = new Error('Solo podés inscribirte a un turno por día');
        error.status = 409;
        throw error;
      }

      const inscripcionesVigentes = await InscripcionTurno.count({
        where: { idTurno, ...estadoActivoWhere },
        transaction
      });
      if (inscripcionesVigentes >= turno.capacidadMaxima) {
        const error = new Error('El turno ya alcanzó su capacidad máxima');
        error.status = 409;
        throw error;
      }

      return InscripcionTurno.create(
        {
          idTurno,
          dniCliente,
          fechaHoraInscripcion: new Date(),
          estado: 'activa'
        },
        { transaction }
      );
    });
    const completa = await InscripcionTurno.findByPk(inscripcion.idInscripcion, {
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['dni', 'nombre', 'apellido']
        }
      ]
    });
    res.status(201).json(completa);
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    sendError(res, 500, 'Error al inscribirse al turno', error);
  }
};

const cancelarInscripcion = async (req, res) => {
  try {
    const idTurno = toPositiveInt(req.params.id);
    if (!idTurno) return res.status(400).json({ message: 'idTurno inválido' });
    const dniCliente = await cargarClienteDeSesion(req);
    if (!dniCliente)
      return res.status(403).json({ message: 'La cuenta no está asociada a un cliente' });

    const inscripcion = await InscripcionTurno.findOne({
      where: { idTurno, dniCliente, ...estadoActivoWhere }
    });
    if (!inscripcion) {
      return res.status(404).json({ message: 'No hay una inscripción vigente para cancelar' });
    }
    await inscripcion.update({ estado: ESTADO_CANCELADA });
    res.json(inscripcion);
  } catch (error) {
    sendError(res, 500, 'Error al cancelar la inscripción', error);
  }
};

// PUT /turnos/:id/inscripciones/:dniCliente { estado } - registra la asistencia del cliente
// (asistio / ausente) o la deja otra vez como activa. Lo hacen el admin y los profesores del turno
const registrarAsistencia = async (req, res) => {
  try {
    const idTurno = toPositiveInt(req.params.id);
    const dniCliente = toPositiveInt(req.params.dniCliente);
    if (!idTurno) return res.status(400).json({ message: 'idTurno inválido' });
    if (!dniCliente) return res.status(400).json({ message: 'dniCliente inválido' });
    if (!ESTADOS_ASISTENCIA.includes(req.body.estado)) {
      return res.status(400).json({
        message: `estado debe ser uno de: ${ESTADOS_ASISTENCIA.join(', ')}`
      });
    }

    const turno = await Turno.findByPk(idTurno);
    if (!turno || turno.fecha === null) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }
    if (req.user.rol === 'profesor') {
      const dictaElTurno = await TurnoProfesor.findOne({
        where: { idTurno, dniProfesor: toPositiveInt(req.user.dniProfesor) }
      });
      if (!dictaElTurno) return res.status(404).json({ message: 'Turno no encontrado' });
    }
    if (turno.fecha > fechaBuenosAires()) {
      return res
        .status(409)
        .json({ message: 'La asistencia se registra el día del turno o después' });
    }

    const inscripcion = await InscripcionTurno.findOne({
      where: { idTurno, dniCliente, ...estadoActivoWhere }
    });
    if (!inscripcion) {
      return res.status(404).json({ message: 'El cliente no tiene una inscripción vigente' });
    }
    await inscripcion.update({ estado: req.body.estado });
    res.json(inscripcion);
  } catch (error) {
    sendError(res, 500, 'Error al registrar la asistencia', error);
  }
};

module.exports = { inscribirse, cancelarInscripcion, registrarAsistencia };
