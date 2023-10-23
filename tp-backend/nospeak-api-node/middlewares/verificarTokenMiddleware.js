const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, '1234', (error, usuario) => {
    if (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.usuario = usuario;
    next();
  });
}

module.exports = verificarToken;
