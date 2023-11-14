const jwt = require('jsonwebtoken');
const config = require('../config');

function verificarRol(req, res, next) {
  // Obtenemos el token desde las cabeceras
  const token = req.headers.authorization;

  // Comprobamos si no hay token
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  // Verificamos el token
  jwt.verify(token, config.tokenSecretKey, (error, usuario) => {
    if (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    // Almacenamos el usuario en la petición
    req.usuario = usuario;
    // Verificar si el usuario tiene el campo isAdmin en true
    if (req.usuario && req.usuario.isAdmin) {
        // Si es administrador, continuar con la solicitud
        next();
      } else {
        // Si no es administrador, devolver un error
        res.status(403).json({ mensaje: 'Acceso no autorizado. Se requieren privilegios de administrador.' });
      }
  });
}

module.exports = verificarRol;










 