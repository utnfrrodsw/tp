const Usuario = require('../models/usuario');
const { COOKIE_NAME, verifyToken, clearAuthCookie } = require('../config/auth');
const { toPositiveInt, sendError } = require('../utils/http');

const rechazar = (res) => {
  clearAuthCookie(res);
  return res.status(401).json({ message: 'Sesión inválida o expirada' });
};

// Verifica el JWT de la cookie y vuelve a consultar el usuario en la DB, para que
// desactivar una cuenta o cambiar la contraseña corte el acceso al instante
const authenticate = async (req, res, next) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: 'No autenticado' });

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return rechazar(res);
  }

  try {
    const id = toPositiveInt(payload.sub);
    const usuario = id ? await Usuario.findByPk(id) : null;
    if (!usuario || !usuario.activo || usuario.tokenVersion !== payload.tv) return rechazar(res);

    req.user = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      dniProfesor: usuario.dniProfesor,
      debeCambiarPassword: usuario.debeCambiarPassword
    };
    next();
  } catch (error) {
    sendError(res, 500, 'Error al verificar la sesión', error);
  }
};

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No tenés permisos para esta acción' });
    }
    next();
  };

module.exports = { authenticate, authorize };
