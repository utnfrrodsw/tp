const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { Cliente, InscripcionTurno, Turno } = require('../models/associations');
const { toPositiveInt, sendError } = require('../utils/http');
const {
  cargarClienteDeSesion,
  fechaHoraLocalAUTC,
  ESTADO_CANCELADA
} = require('./turnoController');

const estadoActivoWhere = {
  [Op.or]: [{ estado: null }, { estado: { [Op.ne]: ESTADO_CANCELADA } }]
};

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

module.exports = { inscribirse, cancelarInscripcion };
