const Usuario = require('../models/usuario');
const { setAuthCookie, clearAuthCookie } = require('../config/auth');
const { validatePassword, hashPassword, verifyPassword } = require('../utils/password');
const { sendError } = require('../utils/http');

const datosPublicos = (usuario) => ({
  id: usuario.id,
  email: usuario.email,
  rol: usuario.rol,
  dniProfesor: usuario.dniProfesor,
  debeCambiarPassword: usuario.debeCambiarPassword
});

// POST /auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'email y password son obligatorios' });
    }

    const usuario = await Usuario.unscoped().findOne({
      where: { email: email.trim().toLowerCase() }
    });
    // Siempre se compara (contra un hash dummy si no existe) y siempre el mismo mensaje,
    // para no revelar qué emails están registrados
    const passwordOk = await verifyPassword(password, usuario?.passwordHash);
    if (!usuario || !passwordOk || !usuario.activo) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    setAuthCookie(res, usuario);
    res.json(datosPublicos(usuario));
  } catch (error) {
    sendError(res, 500, 'Error al iniciar sesión', error);
  }
};

// POST /auth/logout
const logout = (req, res) => {
  clearAuthCookie(res);
  res.json({ message: 'Sesión cerrada' });
};

// GET /auth/me
const me = (req, res) => {
  res.json(req.user);
};

// PUT /auth/password
const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;
    if (typeof passwordActual !== 'string') {
      return res.status(400).json({ message: 'passwordActual es obligatoria' });
    }
    const errorPassword = validatePassword(passwordNueva);
    if (errorPassword) return res.status(400).json({ message: errorPassword });
    if (passwordNueva === passwordActual) {
      return res
        .status(400)
        .json({ message: 'La contraseña nueva tiene que ser distinta de la actual' });
    }

    const usuario = await Usuario.unscoped().findByPk(req.user.id);
    if (!(await verifyPassword(passwordActual, usuario.passwordHash))) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
    }

    await usuario.update({
      passwordHash: await hashPassword(passwordNueva),
      tokenVersion: usuario.tokenVersion + 1,
      debeCambiarPassword: false
    });

    // Las sesiones anteriores quedan invalidadas; esta recibe un token nuevo
    setAuthCookie(res, usuario);
    res.json({ message: 'Contraseña actualizada' });
  } catch (error) {
    sendError(res, 500, 'Error al cambiar la contraseña', error);
  }
};

module.exports = { login, logout, me, cambiarPassword };
