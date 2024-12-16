const Empleado = require('../models/empleado');


const crearEmpleado = async (req, res) => {
  const { idEmpleado, tipoActividad, apellidoYnombre, dni, mail, contrasena } = req.body;
  try {
    const nuevoEmpleado = new Empleado({ idEmpleado, tipoActividad, apellidoYnombre, dni, mail, contrasena });
    await nuevoEmpleado.save();
    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const obtenerTodosEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.find();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const obtenerEmpleadoPorDni = async (req, res) => {
  const { dni } = req.params;
  try {
    const empleado = await Empleado.findOne({ dni });
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado.' });
    }
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const actualizarEmpleadoPorDni = async (req, res) => {
  const { dni } = req.params;
  const { tipoActividad, apellidoYnombre, mail, contrasena } = req.body;
  try {
    const empleado = await Empleado.findOneAndUpdate(
      { dni },
      { tipoActividad, apellidoYnombre, mail, contrasena },
      { new: true }
    );
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado.' });
    }
    res.json(empleado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const eliminarEmpleadoPorDni = async (req, res) => {
  const { dni } = req.params;
  try {
    const empleado = await Empleado.findOneAndDelete({ dni });
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado.' });
    }
    res.json({ message: 'Empleado eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  crearEmpleado,
  obtenerTodosEmpleados,
  obtenerEmpleadoPorDni,
  actualizarEmpleadoPorDni,
  eliminarEmpleadoPorDni
};
