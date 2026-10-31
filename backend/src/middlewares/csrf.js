const { allowedOrigins } = require('../config/auth');

const METODOS_QUE_MODIFICAN = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// La cookie de sesión viaja sola en requests cross-site, así que un sitio ajeno podría
// disparar acciones en nombre del usuario (CSRF). Los navegadores siempre mandan el
// header Origin en estos métodos: si viene y no es el frontend, se rechaza.
const originCheck = (req, res, next) => {
  if (!METODOS_QUE_MODIFICAN.has(req.method)) return next();
  const origin = req.get('Origin');
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ message: 'Origen no permitido' });
  }
  next();
};

module.exports = { originCheck };
