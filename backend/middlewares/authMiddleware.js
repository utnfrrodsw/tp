const jwt = require('jsonwebtoken');

function verificarAutenticacion(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send('Token inválido o expirado');
      } else {
        req.cliente = decoded.cliente; 
        next();
      }
    });
  } else {
    res.status(401).send('Token de autenticación no proporcionado');
  }
}

module.exports = { verificarAutenticacion };
