const jwt = require('jsonwebtoken');
const Cliente = require('../models/cliente');
const Empleado = require('../models/empleado');

function generarTokenEmpleado(empleado) {
  return jwt.sign({ empleado }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function generarToken(cliente) {
  return jwt.sign({ cliente }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

async function iniciarSesion(req, res) {
  const { mail, contrasena } = req.body;
  try {
    const cliente = await Cliente.findOne({ mail, contrasena });

    
    if (cliente) {
      if (cliente.estado === "Bloqueado") {
        return res.status(403).send('Usuario Bloqueado');
      }

      const token = generarToken(cliente);
      res.json({ token, idCliente: cliente.idCli, nombre: cliente.apellidoYnombre });
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
      res.json({ token, dni: empleado.dni, nombre:empleado.apellidoYnombre});
    } else {
      res.status(401).send('Credenciales incorrectas');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


module.exports = { generarToken, iniciarSesion ,generarTokenEmpleado,iniciarSesionEmpleado};
