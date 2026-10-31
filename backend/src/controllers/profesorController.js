const Profesor = require('../models/profesor');
const Especialidad = require('../models/especialidad');
const ProfesorEspecialidad = require('../models/profesorEspecialidad');
const Usuario = require('../models/usuario');
const sequelize = require('../config/database');
const { hashPasswordInicial } = require('../utils/password');
const { toPositiveInt, isValidEmail, sendError, esErrorDeReferencia } = require('../utils/http');

// config. común para incluir las especialidades de un profesor
const especialidadesInclude = {
  model: Especialidad,
  as: 'especialidades',
  attributes: [['id', 'idEspecialidad'], 'nombre'],
  through: { attributes: [] }
};

const textoValido = (valor) => typeof valor === 'string' && valor.trim().length > 0;

// Valida y normaliza los datos del profesor. Con parcial (edición) solo revisa los campos enviados.
// Devuelve { datos } o { error }
const validarCampos = ({ nombre, apellido, telefono, email }, parcial = false) => {
  const datos = {};
  const omitido = (valor) => parcial && valor === undefined;

  for (const [campo, valor] of Object.entries({ nombre, apellido })) {
    if (omitido(valor)) continue;
    if (!textoValido(valor)) return { error: `${campo} es obligatorio` };
    datos[campo] = valor.trim();
  }
  if (!omitido(telefono)) {
    const tel =
      typeof telefono === 'string' || typeof telefono === 'number' ? String(telefono).trim() : '';
    if (!tel) return { error: 'telefono es obligatorio' };
    datos.telefono = tel;
  }
  if (!omitido(email)) {
    if (!isValidEmail(email)) return { error: 'email inválido' };
    datos.email = email.trim().toLowerCase();
  }
  return { datos };
};

const manejarError = (res, error, mensaje) => {
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res
      .status(409)
      .json({ message: 'Ya existe un profesor con ese DNI o una cuenta con ese email' });
  }
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ message: error.errors.map((e) => e.message).join(', ') });
  }
  sendError(res, 500, mensaje, error);
};

const crearCuenta = async (profesor, passwordHash, transaction) =>
  Usuario.create(
    {
      email: profesor.email,
      passwordHash,
      rol: 'profesor',
      dniProfesor: profesor.dni,
      debeCambiarPassword: true
    },
    { transaction }
  );

// GET /profesores - trae todos
const getProfesor = async (req, res) => {
  try {
    const profesores = await Profesor.findAll({
      include: [especialidadesInclude]
    });
    res.json(profesores);
  } catch (error) {
    sendError(res, 500, 'Error al obtener profesores', error);
  }
};

// GET trae un profesor por dni
const getProfesorByPk = async (req, res) => {
  try {
    const dni = toPositiveInt(req.params.dni);
    if (!dni) return res.status(400).json({ message: 'dni inválido' });

    const profesor = await Profesor.findByPk(dni, {
      include: [especialidadesInclude]
    });
    if (!profesor) return res.status(404).json({ message: 'No encontrado' });
    res.json(profesor);
  } catch (error) {
    sendError(res, 500, 'Error al obtener profesor', error);
  }
};

// POST - crea el profesor y su cuenta (contraseña inicial: el DNI) en una transacción
const createProfesor = async (req, res) => {
  try {
    const dniNum = toPositiveInt(req.body.dni);
    if (!dniNum)
      return res.status(400).json({ message: 'dni es obligatorio y debe ser un entero positivo' });
    const { datos: campos, error: errorCampos } = validarCampos(req.body);
    if (errorCampos) return res.status(400).json({ message: errorCampos });

    const datos = { dni: dniNum, ...campos };
    if (await Profesor.findByPk(dniNum)) {
      return res.status(409).json({ message: 'Ya existe un profesor con ese DNI' });
    }
    if (await Usuario.findOne({ where: { email: datos.email } })) {
      return res.status(409).json({ message: 'Ya existe una cuenta con ese email' });
    }

    // El hash se calcula antes de abrir la transacción para no tenerla abierta de más
    const passwordHash = await hashPasswordInicial(dniNum);
    const nuevo = await sequelize.transaction(async (transaction) => {
      const profesor = await Profesor.create(datos, { transaction });
      await crearCuenta(profesor, passwordHash, transaction);
      return profesor;
    });
    res.status(201).json({ ...nuevo.toJSON(), especialidades: [] });
  } catch (error) {
    manejarError(res, error, 'Error al crear profesor');
  }
};

// PUT edita un profesor existente por dni
const updateProfesor = async (req, res) => {
  try {
    const dni = toPositiveInt(req.params.dni);
    if (!dni) return res.status(400).json({ message: 'dni inválido' });

    const profesor = await Profesor.findByPk(dni);
    if (!profesor) return res.status(404).json({ message: 'No encontrado' });

    // Solo se toman los campos editables: el DNI (PK) no se puede modificar
    const { datos, error: errorCampos } = validarCampos(req.body, true);
    if (errorCampos) return res.status(400).json({ message: errorCampos });
    if (!Object.keys(datos).length) {
      return res.status(400).json({ message: 'No se envió ningún campo para actualizar' });
    }

    // El email del profesor es también el de su cuenta: si cambia, se cambian los dos
    const cuenta = await Usuario.findOne({ where: { dniProfesor: dni } });
    const cambiaEmailCuenta = cuenta && datos.email !== undefined && datos.email !== cuenta.email;
    if (cambiaEmailCuenta && (await Usuario.findOne({ where: { email: datos.email } }))) {
      return res.status(409).json({ message: 'Ya existe una cuenta con ese email' });
    }

    await sequelize.transaction(async (transaction) => {
      await profesor.update(datos, { transaction });
      if (cambiaEmailCuenta) await cuenta.update({ email: datos.email }, { transaction });
    });

    const actualizado = await Profesor.findByPk(dni, {
      include: [especialidadesInclude]
    });
    res.json(actualizado);
  } catch (error) {
    manejarError(res, error, 'Error al actualizar profesor');
  }
};

// DELETE elimina un profesor por dni, junto con su cuenta de acceso
const deleteProfesor = async (req, res) => {
  try {
    const dni = toPositiveInt(req.params.dni);
    if (!dni) return res.status(400).json({ message: 'dni inválido' });

    const profesor = await Profesor.findByPk(dni); //busca
    if (!profesor) return res.status(404).json({ message: 'No encontrado' });

    await sequelize.transaction(async (transaction) => {
      await Usuario.destroy({ where: { dniProfesor: dni }, transaction });
      await profesor.destroy({ transaction }); //elimina
    });
    res.json({ message: 'Profesor eliminado' });
  } catch (error) {
    // Sus especialidades se quitan solas (CASCADE); lo que bloquea el borrado son sus rutinas
    if (esErrorDeReferencia(error)) {
      return res.status(409).json({
        message: 'No se puede eliminar: el profesor tiene rutinas asignadas'
      });
    }
    sendError(res, 500, 'Error al eliminar', error);
  }
};

// POST asigna una especialidad a un profesor
const asignarEspecialidad = async (req, res) => {
  try {
    const dni = toPositiveInt(req.params.dni);
    if (!dni) return res.status(400).json({ message: 'dni inválido' });
    const idEspecialidad = toPositiveInt(req.body.idEspecialidad);
    if (!idEspecialidad) return res.status(400).json({ message: 'idEspecialidad inválido' });

    const profesor = await Profesor.findByPk(dni);
    if (!profesor) return res.status(404).json({ message: 'Profesor no encontrado' });
    const especialidad = await Especialidad.findByPk(idEspecialidad);
    if (!especialidad) return res.status(404).json({ message: 'Especialidad no encontrada' });

    // findOrCreate evita la condición de carrera de "buscar y luego crear"
    const [, created] = await ProfesorEspecialidad.findOrCreate({
      where: { dniProfesor: dni, idEspecialidad }
    });
    if (!created) return res.status(409).json({ message: 'La relación ya existe' });

    res.status(201).json({ message: 'Especialidad asignada al profesor' });
  } catch (error) {
    sendError(res, 500, 'Error al asignar especialidad', error);
  }
};

// DELETE quita una especialidad de un profesor
const quitarEspecialidad = async (req, res) => {
  try {
    const dni = toPositiveInt(req.params.dni);
    const idEspecialidad = toPositiveInt(req.params.idEspecialidad);
    if (!dni || !idEspecialidad) return res.status(400).json({ message: 'Parámetros inválidos' });

    const relacion = await ProfesorEspecialidad.findOne({
      where: { dniProfesor: dni, idEspecialidad }
    });
    if (!relacion) return res.status(404).json({ message: 'Relación no encontrada' });
    await relacion.destroy(); //elimina solo la relación
    res.json({ message: 'Especialidad quitada del profesor' });
  } catch (error) {
    sendError(res, 500, 'Error al quitar especialidad', error);
  }
};

module.exports = {
  getProfesor,
  getProfesorByPk,
  createProfesor,
  updateProfesor,
  deleteProfesor,
  asignarEspecialidad,
  quitarEspecialidad
};
