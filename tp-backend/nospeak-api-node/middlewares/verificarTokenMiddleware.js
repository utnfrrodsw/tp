const jwt = require('jsonwebtoken');
const config = require('../config');

function verificarToken(req, res, next) {
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
    next();
  });
}

module.exports = verificarToken;
