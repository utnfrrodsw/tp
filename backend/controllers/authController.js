const jwt = require('jsonwebtoken');
const Cliente = require('../models/cliente');
const Empleado = require('../models/empleado');

function generarTokenEmpleado(empleado) {
  return jwt.sign({ empleado }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

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


async function iniciarSesionEmpleado(req, res) {
  const { mail, contrasena } = req.body;
  try {
    const empleado = await Empleado.findOne({ mail, contrasena });
    if (empleado) {
      const token = generarToken(empleado);
      res.json({ token });
    } else {
      res.status(401).send('Credenciales incorrectas');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


module.exports = { generarToken, iniciarSesion ,generarTokenEmpleado,iniciarSesionEmpleado};
