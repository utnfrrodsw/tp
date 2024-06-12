const jwt = require('jsonwebtoken');
const Cliente = require('../models/cliente');

function generarToken(cliente) {
  return jwt.sign({ cliente }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

async function iniciarSesion(req, res) {
  const { mail, contrasena } = req.body;
  try {
    const cliente = await Cliente.findOne({ mail, contrasena });
    if (cliente) {
      const token = generarToken(cliente);
      res.json({ token });
    } else {
      res.status(401).send('Credenciales incorrectas');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { generarToken, iniciarSesion };
