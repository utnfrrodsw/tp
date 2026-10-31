const { Cliente, Profesor, Rutina, RutinaEjercicio } = require('../models/associations');
const sequelize = require('../config/database');
const { toPositiveInt, sendError } = require('../utils/http');

const rutinaIncludes = [
  { model: RutinaEjercicio, as: 'ejercicios' },
  { model: Cliente, as: 'cliente', attributes: ['dni', 'nombre', 'apellido'] },
  { model: Profesor, as: 'profesor', attributes: ['dni', 'nombre', 'apellido'] }
];

const getScope = async (user) => {
  if (user.rol === 'admin') return {};
  if (user.rol === 'profesor') {
    const dniProfesor = toPositiveInt(user.dniProfesor);
    return dniProfesor ? { dniProfesor } : null;
  }
  if (user.rol === 'cliente') {
    const cliente = await Cliente.findOne({
      where: { idUsuario: user.id },
      attributes: ['dni']
    });
    return cliente ? { dniCliente: cliente.dni } : null;
  }
  return null;
};

const parseExercise = (input, partial = false) => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { error: 'Cada ejercicio debe ser un objeto válido' };
  }

  const values = {};
  if (!partial || input.nombreEjercicio !== undefined) {
    if (typeof input.nombreEjercicio !== 'string' || !input.nombreEjercicio.trim()) {
      return { error: 'nombreEjercicio es obligatorio y debe ser texto' };
    }
    values.nombreEjercicio = input.nombreEjercicio.trim();
  }

  if (!partial || input.series !== undefined) {
    const series = toPositiveInt(input.series);
    if (!series) return { error: 'series debe ser un entero positivo' };
    values.series = series;
  }

  if (!partial || input.repeticiones !== undefined) {
    if (typeof input.repeticiones !== 'string' || !input.repeticiones.trim()) {
      return { error: 'repeticiones es obligatorio y debe ser texto' };
    }
    values.repeticiones = input.repeticiones.trim();
  }

  if (input.descanso !== undefined) {
    if (input.descanso === null) {
      values.descanso = null;
    } else {
      const descansoTexto =
        typeof input.descanso === 'string' ? input.descanso.trim() : String(input.descanso);
      const descanso = /^\d+$/.test(descansoTexto) ? Number(descansoTexto) : NaN;
      if (!Number.isInteger(descanso) || descanso < 0 || descanso > 32767) {
        return { error: 'descanso debe ser un entero entre 0 y 32767, o null' };
      }
      values.descanso = descanso;
    }
  }

  return { values };
};

const validateRoutineReferences = async ({ dniCliente, dniProfesor }) => {
  const cliente = await Cliente.findByPk(dniCliente);
  if (!cliente) return 'Cliente no encontrado';
  const profesor = await Profesor.findByPk(dniProfesor);
  if (!profesor) return 'Profesor no encontrado';
  return null;
};

const getRutinas = async (req, res) => {
  try {
    const scope = await getScope(req.user);
    if (!scope) return res.json([]);

    const rutinas = await Rutina.findAll({
      where: scope,
      include: rutinaIncludes,
      order: [['idRutina', 'ASC']]
    });
    res.json(rutinas);
  } catch (error) {
    sendError(res, 500, 'Error al obtener las rutinas', error);
  }
};

const getRutinaById = async (req, res) => {
  try {
    const idRutina = toPositiveInt(req.params.id);
    if (!idRutina) return res.status(400).json({ message: 'idRutina inválido' });

    const scope = await getScope(req.user);
    if (!scope) return res.status(404).json({ message: 'Rutina no encontrada' });

    const rutina = await Rutina.findOne({
      where: { idRutina, ...scope },
      include: rutinaIncludes
    });
    if (!rutina) return res.status(404).json({ message: 'Rutina no encontrada' });
    res.json(rutina);
  } catch (error) {
    sendError(res, 500, 'Error al obtener la rutina', error);
  }
};

const createRutina = async (req, res) => {
  try {
    const { nombreRutina, diaSemana = null, dniCliente, dniProfesor, ejercicios = [] } = req.body;
    if (typeof nombreRutina !== 'string' || !nombreRutina.trim()) {
      return res.status(400).json({ message: 'nombreRutina es obligatorio y debe ser texto' });
    }
    if (diaSemana !== null && (typeof diaSemana !== 'string' || !diaSemana.trim())) {
      return res.status(400).json({ message: 'diaSemana debe ser texto no vacío o null' });
    }

    const clienteDni = toPositiveInt(dniCliente);
    const profesorDni =
      req.user.rol === 'profesor'
        ? toPositiveInt(req.user.dniProfesor)
        : toPositiveInt(dniProfesor);
    if (!clienteDni || !profesorDni) {
      return res
        .status(400)
        .json({ message: 'dniCliente y dniProfesor son obligatorios y válidos' });
    }
    if (!Array.isArray(ejercicios)) {
      return res.status(400).json({ message: 'ejercicios debe ser un arreglo' });
    }

    const referenciasError = await validateRoutineReferences({
      dniCliente: clienteDni,
      dniProfesor: profesorDni
    });
    if (referenciasError) return res.status(400).json({ message: referenciasError });

    const ejerciciosParseados = ejercicios.map((ejercicio) => parseExercise(ejercicio));
    const errorEjercicio = ejerciciosParseados.find((ejercicio) => ejercicio.error);
    if (errorEjercicio) return res.status(400).json({ message: errorEjercicio.error });

    const rutina = await sequelize.transaction(async (transaction) => {
      const nuevaRutina = await Rutina.create(
        {
          nombreRutina: nombreRutina.trim(),
          diaSemana: diaSemana === null ? null : diaSemana.trim(),
          dniCliente: clienteDni,
          dniProfesor: profesorDni
        },
        { transaction }
      );

      if (ejerciciosParseados.length) {
        await RutinaEjercicio.bulkCreate(
          ejerciciosParseados.map(({ values }) => ({
            ...values,
            idRutina: nuevaRutina.idRutina
          })),
          { transaction }
        );
      }
      return nuevaRutina;
    });

    const rutinaCompleta = await Rutina.findByPk(rutina.idRutina, { include: rutinaIncludes });
    res.status(201).json(rutinaCompleta);
  } catch (error) {
    sendError(res, 500, 'Error al crear la rutina', error);
  }
};

const updateRutina = async (req, res) => {
  try {
    const idRutina = toPositiveInt(req.params.id);
    if (!idRutina) return res.status(400).json({ message: 'idRutina inválido' });

    const scope = await getScope(req.user);
    if (!scope) return res.status(404).json({ message: 'Rutina no encontrada' });
    const rutina = await Rutina.findOne({ where: { idRutina, ...scope } });
    if (!rutina) return res.status(404).json({ message: 'Rutina no encontrada' });

    const values = {};
    const { nombreRutina, diaSemana, dniCliente, dniProfesor } = req.body;
    if (nombreRutina !== undefined) {
      if (typeof nombreRutina !== 'string' || !nombreRutina.trim()) {
        return res.status(400).json({ message: 'nombreRutina debe ser texto no vacío' });
      }
      values.nombreRutina = nombreRutina.trim();
    }
    if (diaSemana !== undefined) {
      if (diaSemana !== null && (typeof diaSemana !== 'string' || !diaSemana.trim())) {
        return res.status(400).json({ message: 'diaSemana debe ser texto no vacío o null' });
      }
      values.diaSemana = diaSemana === null ? null : diaSemana.trim();
    }
    if (dniCliente !== undefined) {
      values.dniCliente = toPositiveInt(dniCliente);
      if (!values.dniCliente) {
        return res.status(400).json({ message: 'dniCliente debe ser un entero positivo' });
      }
    }
    if (dniProfesor !== undefined) {
      const dniProfesorNuevo = toPositiveInt(dniProfesor);
      if (!dniProfesorNuevo) {
        return res.status(400).json({ message: 'dniProfesor debe ser un entero positivo' });
      }

      if (req.user.rol === 'profesor') {
        const dniProfesorActual = toPositiveInt(req.user.dniProfesor);
        if (!dniProfesorActual || dniProfesorNuevo !== dniProfesorActual) {
          return res.status(403).json({
            message: 'Solo podés reasignar la rutina a tu propio dniProfesor'
          });
        }
      }

      if (req.user.rol !== 'admin' && req.user.rol !== 'profesor') {
        return res
          .status(403)
          .json({ message: 'Solo admin puede reasignar una rutina a otro profesor' });
      }

      values.dniProfesor = dniProfesorNuevo;
    }
    if (!Object.keys(values).length) {
      return res.status(400).json({ message: 'Debe enviar al menos un campo para actualizar' });
    }

    const referenciasError = await validateRoutineReferences({
      dniCliente: values.dniCliente ?? rutina.dniCliente,
      dniProfesor: values.dniProfesor ?? rutina.dniProfesor
    });
    if (referenciasError) return res.status(400).json({ message: referenciasError });

    await rutina.update(values);
    const rutinaCompleta = await Rutina.findByPk(idRutina, { include: rutinaIncludes });
    res.json(rutinaCompleta);
  } catch (error) {
    sendError(res, 500, 'Error al actualizar la rutina', error);
  }
};

const deleteRutina = async (req, res) => {
  try {
    const idRutina = toPositiveInt(req.params.id);
    if (!idRutina) return res.status(400).json({ message: 'idRutina inválido' });

    const scope = await getScope(req.user);
    if (!scope) return res.status(404).json({ message: 'Rutina no encontrada' });
    const rutina = await Rutina.findOne({ where: { idRutina, ...scope } });
    if (!rutina) return res.status(404).json({ message: 'Rutina no encontrada' });

    await sequelize.transaction(async (transaction) => {
      await RutinaEjercicio.destroy({ where: { idRutina }, transaction });
      await rutina.destroy({ transaction });
    });
    res.json({ message: 'Rutina eliminada correctamente' });
  } catch (error) {
    sendError(res, 500, 'Error al eliminar la rutina', error);
  }
};

const createEjercicio = async (req, res) => {
  try {
    const idRutina = toPositiveInt(req.params.id);
    if (!idRutina) return res.status(400).json({ message: 'idRutina inválido' });

    const scope = await getScope(req.user);
    if (!scope) return res.status(404).json({ message: 'Rutina no encontrada' });
    const rutina = await Rutina.findOne({ where: { idRutina, ...scope } });
    if (!rutina) return res.status(404).json({ message: 'Rutina no encontrada' });

    const { values, error } = parseExercise(req.body);
    if (error) return res.status(400).json({ message: error });
    const ejercicio = await RutinaEjercicio.create({ ...values, idRutina });
    res.status(201).json(ejercicio);
  } catch (error) {
    sendError(res, 500, 'Error al agregar el ejercicio', error);
  }
};

const updateEjercicio = async (req, res) => {
  try {
    const idRutina = toPositiveInt(req.params.id);
    const idEjercicio = toPositiveInt(req.params.idEjercicio);
    if (!idRutina || !idEjercicio) {
      return res.status(400).json({ message: 'idRutina o idEjercicio inválido' });
    }

    const scope = await getScope(req.user);
    if (!scope) return res.status(404).json({ message: 'Rutina no encontrada' });
    const rutina = await Rutina.findOne({ where: { idRutina, ...scope } });
    if (!rutina) return res.status(404).json({ message: 'Rutina no encontrada' });

    const ejercicio = await RutinaEjercicio.findOne({ where: { id: idEjercicio, idRutina } });
    if (!ejercicio) return res.status(404).json({ message: 'Ejercicio no encontrado' });

    const { values, error } = parseExercise(req.body, true);
    if (error) return res.status(400).json({ message: error });
    if (!Object.keys(values).length) {
      return res.status(400).json({ message: 'Debe enviar al menos un campo para actualizar' });
    }

    await ejercicio.update(values);
    res.json(ejercicio);
  } catch (error) {
    sendError(res, 500, 'Error al actualizar el ejercicio', error);
  }
};

const deleteEjercicio = async (req, res) => {
  try {
    const idRutina = toPositiveInt(req.params.id);
    const idEjercicio = toPositiveInt(req.params.idEjercicio);
    if (!idRutina || !idEjercicio) {
      return res.status(400).json({ message: 'idRutina o idEjercicio inválido' });
    }

    const scope = await getScope(req.user);
    if (!scope) return res.status(404).json({ message: 'Rutina no encontrada' });
    const rutina = await Rutina.findOne({ where: { idRutina, ...scope } });
    if (!rutina) return res.status(404).json({ message: 'Rutina no encontrada' });

    const ejercicio = await RutinaEjercicio.findOne({ where: { id: idEjercicio, idRutina } });
    if (!ejercicio) return res.status(404).json({ message: 'Ejercicio no encontrado' });

    await ejercicio.destroy();
    res.json({ message: 'Ejercicio eliminado correctamente' });
  } catch (error) {
    sendError(res, 500, 'Error al eliminar el ejercicio', error);
  }
};

module.exports = {
  getRutinas,
  getRutinaById,
  createRutina,
  updateRutina,
  deleteRutina,
  createEjercicio,
  updateEjercicio,
  deleteEjercicio
};
