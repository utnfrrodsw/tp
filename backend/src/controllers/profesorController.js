const Profesor = require('../models/profesor');
const Especialidad = require('../models/especialidad');
const ProfesorEspecialidad = require('../models/profesorEspecialidad');
const Usuario = require('../models/usuario');
const sequelize = require('../config/database');
const { hashPasswordInicial } = require('../utils/password');
const { toPositiveInt, isValidEmail, sendError } = require('../utils/http');

// config. común para incluir las especialidades de un profesor
const especialidadesInclude = {
  model: Especialidad,
  as: 'especialidades',
  attributes: [['id', 'idEspecialidad'], 'nombre'],
  through: { attributes: [] }
};

// Solo para saber si tiene cuenta: los datos de la cuenta no se exponen en este endpoint
const usuarioInclude = { model: Usuario, as: 'usuario', attributes: ['id'] };

const aRespuesta = (profesor) => {
  const { usuario, ...datos } = profesor.toJSON();
  return { ...datos, tieneCuenta: Boolean(usuario) };
};

// Revisa si se le puede crear la cuenta de acceso a un profesor.
// Devuelve null si se puede, o un objeto { status, message } con el motivo si no
const validarNuevaCuenta = async (profesor) => {
  if (await Usuario.findOne({ where: { dniProfesor: profesor.dni } })) {
    return { status: 409, message: 'El profesor ya tiene una cuenta' };
  }
  if (!isValidEmail(profesor.email)) {
    return {
      status: 400,
      message: 'El email del profesor no es válido: corregilo antes de darle acceso'
    };
  }
  if (await Usuario.findOne({ where: { email: profesor.email.trim().toLowerCase() } })) {
    return { status: 409, message: 'Ya existe una cuenta con el email del profesor' };
  }
  return null;
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
      include: [especialidadesInclude, usuarioInclude]
    });
    res.json(profesores.map(aRespuesta));
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
      include: [especialidadesInclude, usuarioInclude]
    });
    if (!profesor) return res.status(404).json({ message: 'No encontrado' });
    res.json(aRespuesta(profesor));
  } catch (error) {
    sendError(res, 500, 'Error al obtener profesor', error);
  }
};

// POST - crea nuevo profesor. Con crearCuenta: true también crea su cuenta (contraseña inicial: el DNI)
const createProfesor = async (req, res) => {
  try {
    const { dni, nombre, apellido, telefono, email, crearCuenta: conCuenta } = req.body;
    const dniNum = toPositiveInt(dni);
    if (!dniNum)
      return res.status(400).json({ message: 'dni es obligatorio y debe ser un entero positivo' });
    if (!nombre || !apellido || !telefono || !email) {
      return res
        .status(400)
        .json({ message: 'nombre, apellido, telefono y email son obligatorios' });
    }
    if (!isValidEmail(email)) return res.status(400).json({ message: 'email inválido' });
    if (conCuenta !== undefined && typeof conCuenta !== 'boolean') {
      return res.status(400).json({ message: 'crearCuenta debe ser true o false' });
    }

    const datos = { dni: dniNum, nombre, apellido, telefono: String(telefono), email };
    if (!conCuenta) {
      const nuevo = await Profesor.create(datos);
      return res.status(201).json({ ...nuevo.toJSON(), tieneCuenta: false });
    }

    if (await Profesor.findByPk(dniNum)) {
      return res.status(409).json({ message: 'Ya existe un profesor con ese DNI' });
    }
    const rechazo = await validarNuevaCuenta(datos);
    if (rechazo) return res.status(rechazo.status).json({ message: rechazo.message });

    // El hash se calcula antes de abrir la transacción para no tenerla abierta de más
    const passwordHash = await hashPasswordInicial(dniNum);
    const nuevo = await sequelize.transaction(async (transaction) => {
      const profesor = await Profesor.create(datos, { transaction });
      await crearCuenta(profesor, passwordHash, transaction);
      return profesor;
    });
    res.status(201).json({ ...nuevo.toJSON(), tieneCuenta: true });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res
        .status(409)
        .json({ message: 'Ya existe un profesor con ese DNI o una cuenta con ese email' });
    }
    sendError(res, 400, 'Error al crear profesor', error);
  }
};

// POST /profesores/:dni/cuenta - da acceso a un profesor que todavía no tiene cuenta
const crearCuentaProfesor = async (req, res) => {
  try {
    const dni = toPositiveInt(req.params.dni);
    if (!dni) return res.status(400).json({ message: 'dni inválido' });

    const profesor = await Profesor.findByPk(dni);
    if (!profesor) return res.status(404).json({ message: 'No encontrado' });
    const rechazo = await validarNuevaCuenta(profesor);
    if (rechazo) return res.status(rechazo.status).json({ message: rechazo.message });

    await crearCuenta(profesor, await hashPasswordInicial(dni));
    res
      .status(201)
      .json({ message: 'Cuenta creada. La contraseña inicial es el DNI del profesor.' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res
        .status(409)
        .json({ message: 'El profesor ya tiene cuenta o el email está en uso' });
    }
    sendError(res, 500, 'Error al crear la cuenta', error);
  }
};

// PUT edita un profesor existente por dni
const updateProfesor = async (req, res) => {
  try {
    const dni = toPositiveInt(req.params.dni);
    if (!dni) return res.status(400).json({ message: 'dni inválido' });

    const profesor = await Profesor.findByPk(dni); //busca
    if (!profesor) return res.status(404).json({ message: 'No encontrado' });

    const { dni: _dni, ...datos } = req.body; // la PK no se puede modificar por este endpoint
    if (datos.telefono !== undefined) datos.telefono = String(datos.telefono);
    if (datos.email !== undefined && !isValidEmail(datos.email)) {
      return res.status(400).json({ message: 'email inválido' });
    }

    await profesor.update(datos); //actualiza
    res.json(profesor);
  } catch (error) {
    sendError(res, 400, 'Error al actualizar', error);
  }
};

// DELETE elimina un profesor por dni, junto con su cuenta de acceso si tiene
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
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({
        message: 'No se puede eliminar: el profesor tiene registros asociados (especialidades)'
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
  crearCuentaProfesor,
  updateProfesor,
  deleteProfesor,
  asignarEspecialidad,
  quitarEspecialidad
};
