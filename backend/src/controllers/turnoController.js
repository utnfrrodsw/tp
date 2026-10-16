const { Op } = require('sequelize');
const sequelize = require('../config/database');
const {
  Cliente,
  InscripcionTurno,
  Profesor,
  TipoClase,
  Turno,
  TurnoProfesor
} = require('../models/associations');
const { toPositiveInt, sendError } = require('../utils/http');

const ZONA_HORARIA = 'America/Argentina/Buenos_Aires';
const DIAS_GENERACION = 30;
const ESTADO_CANCELADA = 'cancelada';

const getPartesFecha = (fecha) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);
  if (!match) return null;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
};

const fechaBuenosAires = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA_HORARIA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
};

const sumarDias = (fecha, dias) => {
  const { year, month, day } = getPartesFecha(fecha);
  const result = new Date(Date.UTC(year, month - 1, day + dias));
  return result.toISOString().slice(0, 10);
};

const parseHora = (value) => {
  if (typeof value !== 'string') return null;
  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value.trim());
  if (!match) return null;
  const [, hourText, minuteText, secondText = '00'] = match;
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);
  if (hour > 23 || minute > 59 || second > 59) return null;
  return `${hourText}:${minuteText}:${secondText}`;
};

const fechaHoraLocalAUTC = (fecha, hora) => {
  const dateParts = getPartesFecha(fecha);
  const timeParts = /^(\d{2}):(\d{2}):(\d{2})$/.exec(hora);
  if (!dateParts || !timeParts) return NaN;
  const [, hour, minute, second] = timeParts;
  const wallClockAsUtc = Date.UTC(
    dateParts.year,
    dateParts.month - 1,
    dateParts.day,
    Number(hour),
    Number(minute),
    Number(second)
  );
  const zonedParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONA_HORARIA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(new Date(wallClockAsUtc));
  const values = Object.fromEntries(zonedParts.map(({ type, value }) => [type, value]));
  const offsetAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );
  const offsetMinutes = (offsetAsUtc - wallClockAsUtc) / 60000;
  return wallClockAsUtc - offsetMinutes * 60000;
};

const includeTurno = (req, includeInscripciones = true) => {
  const include = [
    { model: TipoClase, as: 'tipoClase' },
    {
      model: Profesor,
      as: 'profesores',
      attributes: ['dni', 'nombre', 'apellido'],
      through: { attributes: [] },
      ...(req.user.rol === 'profesor'
        ? {
            where: { dni: toPositiveInt(req.user.dniProfesor) },
            required: true
          }
        : {})
    }
  ];

  if (includeInscripciones) {
    const inscripcionWhere =
      req.user.rol === 'cliente' ? { dniCliente: req.dniCliente } : undefined;
    include.push({
      model: InscripcionTurno,
      as: 'inscripciones',
      ...(inscripcionWhere ? { where: inscripcionWhere } : {}),
      required: false,
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['dni', 'nombre', 'apellido']
        }
      ]
    });
  }
  return include;
};

const cargarClienteDeSesion = async (req) => {
  if (req.user.rol !== 'cliente') return null;
  const cliente = await Cliente.findOne({
    where: { idUsuario: req.user.id },
    attributes: ['dni']
  });
  return cliente ? toPositiveInt(cliente.dni) : null;
};

const generarTurnosDiarios = async () => {
  const fechaInicio = fechaBuenosAires();
  const fechaFin = sumarDias(fechaInicio, DIAS_GENERACION - 1);
  const plantillas = await Turno.findAll({
    where: { fecha: null },
    order: [['idTurno', 'ASC']]
  });

  for (const plantilla of plantillas) {
    const horaInicio = parseHora(String(plantilla.horaInicio || ''));
    const horaFin = parseHora(String(plantilla.horaFin || ''));
    const capacidad = toPositiveInt(plantilla.capacidadMaxima);
    if (!horaInicio || !horaFin || horaFin <= horaInicio || !capacidad) {
      throw new Error(`La plantilla de turno ${plantilla.idTurno} tiene datos inválidos`);
    }

    await sequelize.transaction(async (transaction) => {
      const plantillaBloqueada = await Turno.findByPk(plantilla.idTurno, {
        transaction,
        lock: transaction.LOCK.UPDATE
      });
      if (!plantillaBloqueada || plantillaBloqueada.fecha !== null) return;

      const existentes = await Turno.findAll({
        where: {
          idClase: plantilla.idClase,
          fecha: { [Op.between]: [fechaInicio, fechaFin] },
          horaInicio,
          horaFin,
          capacidadMaxima: capacidad
        },
        attributes: ['fecha'],
        transaction
      });
      const fechasExistentes = new Set(existentes.map(({ fecha }) => fecha));
      const fechasNuevas = [];
      for (let dia = 0; dia < DIAS_GENERACION; dia += 1) {
        const fecha = sumarDias(fechaInicio, dia);
        if (!fechasExistentes.has(fecha)) fechasNuevas.push(fecha);
      }
      if (!fechasNuevas.length) return;

      const ocurrencias = await Turno.bulkCreate(
        fechasNuevas.map((fecha) => ({
          idClase: plantilla.idClase,
          fecha,
          horaInicio,
          horaFin,
          capacidadMaxima: capacidad,
          estado: plantilla.estado
        })),
        { transaction, returning: true }
      );
      const profesores = await TurnoProfesor.findAll({
        where: { idTurno: plantilla.idTurno },
        attributes: ['dniProfesor'],
        transaction
      });
      const asignaciones = ocurrencias.flatMap((turno) =>
        profesores.map(({ dniProfesor }) => ({
          idTurno: turno.idTurno,
          dniProfesor
        }))
      );
      if (asignaciones.length) {
        await TurnoProfesor.bulkCreate(asignaciones, { transaction });
      }
    });
  }
};

const parseTurnoValues = (input, partial = false) => {
  const values = {};
  if (!partial || input.idClase !== undefined) {
    values.idClase = toPositiveInt(input.idClase);
    if (!values.idClase) return { error: 'idClase debe ser un entero positivo' };
  }
  if (!partial || input.fecha !== undefined) {
    if (input.fecha !== null && !getPartesFecha(input.fecha)) {
      return { error: 'fecha debe tener formato YYYY-MM-DD o ser null' };
    }
    values.fecha = input.fecha;
  }
  if (!partial || input.horaInicio !== undefined) {
    values.horaInicio = parseHora(input.horaInicio);
    if (!values.horaInicio) return { error: 'horaInicio debe tener formato HH:mm o HH:mm:ss' };
  }
  if (!partial || input.horaFin !== undefined) {
    values.horaFin = parseHora(input.horaFin);
    if (!values.horaFin) return { error: 'horaFin debe tener formato HH:mm o HH:mm:ss' };
  }
  if (values.horaInicio && values.horaFin && values.horaFin <= values.horaInicio) {
    return { error: 'horaFin debe ser posterior a horaInicio' };
  }
  if (!partial || input.capacidadMaxima !== undefined) {
    values.capacidadMaxima = toPositiveInt(input.capacidadMaxima);
    if (!values.capacidadMaxima) {
      return { error: 'capacidadMaxima debe ser un entero positivo' };
    }
  }
  if (input.estado !== undefined) {
    if (input.estado !== null && (typeof input.estado !== 'string' || !input.estado.trim())) {
      return { error: 'estado debe ser texto no vacío o null' };
    }
    values.estado = input.estado === null ? null : input.estado.trim();
  }
  if (
    !partial &&
    (input.fecha === undefined || input.horaInicio === undefined || input.horaFin === undefined)
  ) {
    return { error: 'fecha es obligatoria (puede ser null para crear una plantilla)' };
  }
  return { values };
};

const parseDniProfesores = async (dniProfesores) => {
  if (dniProfesores === undefined) return { values: null };
  if (!Array.isArray(dniProfesores)) {
    return { error: 'dniProfesores debe ser un arreglo de DNI' };
  }
  const values = [...new Set(dniProfesores.map(toPositiveInt))];
  if (values.some((dni) => !dni)) return { error: 'Cada DNI de profesor debe ser válido' };
  const profesores = await Profesor.findAll({
    where: { dni: { [Op.in]: values } },
    attributes: ['dni']
  });
  if (profesores.length !== values.length) {
    return { error: 'Uno o más profesores no existen' };
  }
  return { values };
};

const getTurnos = async (req, res) => {
  try {
    req.dniCliente = await cargarClienteDeSesion(req);
    if (req.user.rol === 'cliente' && !req.dniCliente) return res.json([]);
    await generarTurnosDiarios();

    const where = { fecha: { [Op.not]: null } };
    if (req.query.fecha !== undefined) {
      if (!getPartesFecha(req.query.fecha)) {
        return res.status(400).json({ message: 'fecha debe tener formato YYYY-MM-DD' });
      }
      where.fecha = req.query.fecha;
    } else {
      if (req.query.desde !== undefined && !getPartesFecha(req.query.desde)) {
        return res.status(400).json({ message: 'desde debe tener formato YYYY-MM-DD' });
      }
      if (req.query.hasta !== undefined && !getPartesFecha(req.query.hasta)) {
        return res.status(400).json({ message: 'hasta debe tener formato YYYY-MM-DD' });
      }
      if (req.query.desde || req.query.hasta) {
        where.fecha = {};
        if (req.query.desde) where.fecha[Op.gte] = req.query.desde;
        if (req.query.hasta) where.fecha[Op.lte] = req.query.hasta;
      }
      if (!req.query.desde && !req.query.hasta && req.user.rol !== 'admin') {
        const hoy = fechaBuenosAires();
        where.fecha = { [Op.between]: [hoy, sumarDias(hoy, DIAS_GENERACION - 1)] };
      }
    }

    const turnos = await Turno.findAll({
      where,
      include: includeTurno(req),
      order: [
        ['fecha', 'ASC'],
        ['horaInicio', 'ASC'],
        ['idTurno', 'ASC']
      ]
    });
    res.json(turnos);
  } catch (error) {
    sendError(res, 500, 'Error al obtener los turnos', error);
  }
};

const getPlantillas = async (req, res) => {
  try {
    const plantillas = await Turno.findAll({
      where: { fecha: null },
      include: includeTurno(req, false),
      order: [['idTurno', 'ASC']]
    });
    res.json(plantillas);
  } catch (error) {
    sendError(res, 500, 'Error al obtener las plantillas de turnos', error);
  }
};

const getTurnoById = async (req, res) => {
  try {
    const idTurno = toPositiveInt(req.params.id);
    if (!idTurno) return res.status(400).json({ message: 'idTurno inválido' });
    req.dniCliente = await cargarClienteDeSesion(req);

    const turno = await Turno.findByPk(idTurno, {
      include: includeTurno(req)
    });
    if (!turno || (req.user.rol === 'cliente' && !req.dniCliente)) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }
    if (req.user.rol === 'cliente' && turno.fecha === null) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }
    res.json(turno);
  } catch (error) {
    sendError(res, 500, 'Error al obtener el turno', error);
  }
};

const createTurno = async (req, res) => {
  try {
    const parsed = parseTurnoValues(req.body);
    if (parsed.error) return res.status(400).json({ message: parsed.error });
    const profesoresParsed = await parseDniProfesores(req.body.dniProfesores);
    if (profesoresParsed.error) {
      return res.status(400).json({ message: profesoresParsed.error });
    }

    const tipo = await TipoClase.findByPk(parsed.values.idClase);
    if (!tipo) return res.status(400).json({ message: 'Tipo de clase no encontrado' });

    const turno = await sequelize.transaction(async (transaction) => {
      const nuevoTurno = await Turno.create(parsed.values, { transaction });
      if (profesoresParsed.values?.length) {
        await TurnoProfesor.bulkCreate(
          profesoresParsed.values.map((dniProfesor) => ({
            idTurno: nuevoTurno.idTurno,
            dniProfesor
          })),
          { transaction }
        );
      }
      return nuevoTurno;
    });
    const completo = await Turno.findByPk(turno.idTurno, {
      include: includeTurno({ user: { rol: 'admin' } })
    });
    res.status(201).json(completo);
  } catch (error) {
    sendError(res, 500, 'Error al crear el turno', error);
  }
};

const updateTurno = async (req, res) => {
  try {
    const idTurno = toPositiveInt(req.params.id);
    if (!idTurno) return res.status(400).json({ message: 'idTurno inválido' });
    const turno = await Turno.findByPk(idTurno);
    if (!turno) return res.status(404).json({ message: 'Turno no encontrado' });

    const parsed = parseTurnoValues(req.body, true);
    if (parsed.error) return res.status(400).json({ message: parsed.error });
    const profesoresParsed = await parseDniProfesores(req.body.dniProfesores);
    if (profesoresParsed.error) {
      return res.status(400).json({ message: profesoresParsed.error });
    }
    const idClase = parsed.values.idClase ?? turno.idClase;
    if (parsed.values.idClase !== undefined && !(await TipoClase.findByPk(idClase))) {
      return res.status(400).json({ message: 'Tipo de clase no encontrado' });
    }
    const horaInicio = parsed.values.horaInicio ?? String(turno.horaInicio);
    const horaFin = parsed.values.horaFin ?? String(turno.horaFin);
    if (horaFin <= horaInicio) {
      return res.status(400).json({ message: 'horaFin debe ser posterior a horaInicio' });
    }
    const capacidad = parsed.values.capacidadMaxima ?? turno.capacidadMaxima;
    const inscripcionesActivas = await InscripcionTurno.count({
      where: {
        idTurno,
        [Op.or]: [{ estado: null }, { estado: { [Op.ne]: ESTADO_CANCELADA } }]
      }
    });
    if (capacidad !== null && capacidad < inscripcionesActivas) {
      return res.status(409).json({
        message: 'La capacidad máxima no puede ser menor que las inscripciones vigentes'
      });
    }

    await sequelize.transaction(async (transaction) => {
      await turno.update(parsed.values, { transaction });
      if (profesoresParsed.values !== null) {
        await TurnoProfesor.destroy({ where: { idTurno }, transaction });
        if (profesoresParsed.values.length) {
          await TurnoProfesor.bulkCreate(
            profesoresParsed.values.map((dniProfesor) => ({ idTurno, dniProfesor })),
            { transaction }
          );
        }
      }
    });
    const completo = await Turno.findByPk(idTurno, {
      include: includeTurno({ user: { rol: 'admin' } })
    });
    res.json(completo);
  } catch (error) {
    sendError(res, 500, 'Error al actualizar el turno', error);
  }
};

const deleteTurno = async (req, res) => {
  try {
    const idTurno = toPositiveInt(req.params.id);
    if (!idTurno) return res.status(400).json({ message: 'idTurno inválido' });
    const turno = await Turno.findByPk(idTurno);
    if (!turno) return res.status(404).json({ message: 'Turno no encontrado' });

    const cantidadInscripciones = await InscripcionTurno.count({ where: { idTurno } });
    if (cantidadInscripciones) {
      return res.status(409).json({
        message: 'No se puede eliminar un turno que tiene inscripciones registradas'
      });
    }
    await sequelize.transaction(async (transaction) => {
      await TurnoProfesor.destroy({ where: { idTurno }, transaction });
      await turno.destroy({ transaction });
    });
    res.json({ message: 'Turno eliminado' });
  } catch (error) {
    sendError(res, 500, 'Error al eliminar el turno', error);
  }
};

const getInscripcionesTurno = async (req, res) => {
  try {
    const idTurno = toPositiveInt(req.params.id);
    if (!idTurno) return res.status(400).json({ message: 'idTurno inválido' });
    const turno = await Turno.findByPk(idTurno, {
      include: [
        {
          model: Profesor,
          as: 'profesores',
          attributes: ['dni'],
          through: { attributes: [] },
          ...(req.user.rol === 'profesor'
            ? { where: { dni: toPositiveInt(req.user.dniProfesor) }, required: true }
            : {})
        }
      ]
    });
    if (!turno) return res.status(404).json({ message: 'Turno no encontrado' });
    const inscripciones = await InscripcionTurno.findAll({
      where: { idTurno },
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['dni', 'nombre', 'apellido']
        }
      ],
      order: [['fechaHoraInscripcion', 'ASC']]
    });
    res.json(inscripciones);
  } catch (error) {
    sendError(res, 500, 'Error al obtener las inscripciones del turno', error);
  }
};

module.exports = {
  getTurnos,
  getPlantillas,
  getTurnoById,
  createTurno,
  updateTurno,
  deleteTurno,
  getInscripcionesTurno,
  cargarClienteDeSesion,
  fechaHoraLocalAUTC,
  ESTADO_CANCELADA
};
