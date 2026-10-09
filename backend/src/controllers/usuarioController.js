const Usuario = require('../models/usuario');
const Profesor = require('../models/profesor');
const { setAuthCookie } = require('../config/auth');
const { validatePassword, hashPassword } = require('../utils/password');
const { toPositiveInt, isValidEmail, sendError } = require('../utils/http');

// Un usuario cliente siempre va junto con su registro de Cliente: se crean y borran desde ahí
const MENSAJE_CLIENTES = 'Las cuentas de clientes se gestionan desde /api/clientes';

const manejarErrorDeGuardado = (res, error, mensaje) => {
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res
      .status(409)
      .json({ message: 'Ya existe un usuario con ese email, o ese profesor ya tiene cuenta' });
  }
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ message: error.errors.map((e) => e.message).join(', ') });
  }
  sendError(res, 500, mensaje, error);
};

// Devuelve el dni validado, o un objeto { status, message } si hay que rechazar
const resolverDniProfesor = async (valor) => {
  const dni = toPositiveInt(valor);
  if (!dni) return { status: 400, message: 'dniProfesor inválido' };
  if (!(await Profesor.findByPk(dni))) return { status: 404, message: 'Profesor no encontrado' };
  return dni;
};

// GET /usuarios
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ order: [['id', 'ASC']] });
    res.json(usuarios);
  } catch (error) {
    sendError(res, 500, 'Error al obtener usuarios', error);
  }
};

// GET /usuarios/:id
const getUsuarioById = async (req, res) => {
  try {
    const id = toPositiveInt(req.params.id);
    if (!id) return res.status(400).json({ message: 'id inválido' });

    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'No encontrado' });
    res.json(usuario);
  } catch (error) {
    sendError(res, 500, 'Error al obtener usuario', error);
  }
};

// POST /usuarios
const createUsuario = async (req, res) => {
  try {
    const { email, password, rol, dniProfesor } = req.body;
    if (!isValidEmail(email)) return res.status(400).json({ message: 'email inválido' });
    const errorPassword = validatePassword(password);
    if (errorPassword) return res.status(400).json({ message: errorPassword });
    if (!Usuario.ROLES.includes(rol)) return res.status(400).json({ message: 'rol inválido' });
    if (rol === 'cliente') return res.status(400).json({ message: MENSAJE_CLIENTES });

    let dni = null;
    if (rol === 'profesor') {
      dni = await resolverDniProfesor(dniProfesor);
      if (typeof dni === 'object') return res.status(dni.status).json({ message: dni.message });
    } else if (dniProfesor !== undefined && dniProfesor !== null) {
      return res
        .status(400)
        .json({ message: 'dniProfesor solo aplica a usuarios con rol profesor' });
    }

    const nuevo = await Usuario.create({
      email,
      passwordHash: await hashPassword(password),
      rol,
      dniProfesor: dni,
      // La contraseña la eligió el admin: se le recuerda al usuario que elija la suya
      debeCambiarPassword: true
    });
    res.status(201).json(nuevo);
  } catch (error) {
    manejarErrorDeGuardado(res, error, 'Error al crear usuario');
  }
};

// PUT /usuarios/:id - admite rol, activo, password y dniProfesor
const updateUsuario = async (req, res) => {
  try {
    const id = toPositiveInt(req.params.id);
    if (!id) return res.status(400).json({ message: 'id inválido' });

    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'No encontrado' });

    const { rol, activo, password, dniProfesor } = req.body;
    const esElMismo = usuario.id === req.user.id;
    const cambios = {};

    if (rol !== undefined) {
      if (!Usuario.ROLES.includes(rol)) return res.status(400).json({ message: 'rol inválido' });
      if (esElMismo && rol !== 'admin') {
        return res.status(400).json({ message: 'No podés quitarte el rol de admin' });
      }
      if (rol !== usuario.rol && (rol === 'cliente' || usuario.rol === 'cliente')) {
        return res.status(400).json({ message: MENSAJE_CLIENTES });
      }
      cambios.rol = rol;
    }

    if (activo !== undefined) {
      if (typeof activo !== 'boolean') {
        return res.status(400).json({ message: 'activo debe ser true o false' });
      }
      if (esElMismo && !activo) {
        return res.status(400).json({ message: 'No podés desactivar tu propia cuenta' });
      }
      cambios.activo = activo;
    }

    const rolFinal = cambios.rol ?? usuario.rol;
    if (rolFinal === 'profesor') {
      if (dniProfesor !== undefined) {
        const dni = await resolverDniProfesor(dniProfesor);
        if (typeof dni === 'object') return res.status(dni.status).json({ message: dni.message });
        cambios.dniProfesor = dni;
      } else if (!usuario.dniProfesor) {
        return res
          .status(400)
          .json({ message: 'Un usuario con rol profesor debe tener dniProfesor' });
      }
    } else {
      if (dniProfesor !== undefined && dniProfesor !== null) {
        return res
          .status(400)
          .json({ message: 'dniProfesor solo aplica a usuarios con rol profesor' });
      }
      cambios.dniProfesor = null;
    }

    if (password !== undefined) {
      const errorPassword = validatePassword(password);
      if (errorPassword) return res.status(400).json({ message: errorPassword });
      cambios.passwordHash = await hashPassword(password);
      // Si el admin le pone una contraseña a otro usuario, se le recuerda que elija la suya
      cambios.debeCambiarPassword = !esElMismo;
    }

    // Cambio de contraseña o de rol: se invalidan las sesiones abiertas de ese usuario
    const invalidarSesiones =
      cambios.passwordHash !== undefined ||
      (cambios.rol !== undefined && cambios.rol !== usuario.rol);
    if (invalidarSesiones) cambios.tokenVersion = usuario.tokenVersion + 1;

    await usuario.update(cambios);
    if (esElMismo && invalidarSesiones) setAuthCookie(res, usuario);
    res.json(usuario);
  } catch (error) {
    manejarErrorDeGuardado(res, error, 'Error al actualizar usuario');
  }
};

// DELETE /usuarios/:id
const deleteUsuario = async (req, res) => {
  try {
    const id = toPositiveInt(req.params.id);
    if (!id) return res.status(400).json({ message: 'id inválido' });
    if (id === req.user.id) {
      return res.status(400).json({ message: 'No podés eliminar tu propia cuenta' });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'No encontrado' });
    if (usuario.rol === 'cliente') return res.status(400).json({ message: MENSAJE_CLIENTES });

    await usuario.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res
        .status(409)
        .json({ message: 'No se puede eliminar: el usuario tiene registros asociados' });
    }
    sendError(res, 500, 'Error al eliminar usuario', error);
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
};
