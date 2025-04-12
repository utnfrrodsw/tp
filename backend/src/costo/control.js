
const Socio = require('../models/socio.model');

// Obtener todos los socios
const obtenerSocios = async (req, res) => {
  try {
    const socios = await Socio.find();
    res.json(socios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// nuevo socio
const crearSocio = async (req, res) => {
  const nuevoSocio = new Socio(req.body);
  try {
    const socioCreado = await nuevoSocio.save();
    res.status(201).json(socioCreado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//socio por su ID
const obtenerSocioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const socio = await Socio.findById(id);
    if (!socio) {
      return res.status(404).json({ message: 'Socio no encontrado' });
    }
    res.json(socio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Actualizar 
const actualizarSocio = async (req, res) => {
  const { id } = req.params;
  try {
    const socioActualizado = await Socio.findByIdAndUpdate(id, req.body, { new: true });
    if (!socioActualizado) {
      return res.status(404).json({ message: 'Socio no encontrado para actualizar' });
    }
    res.json(socioActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar 
const eliminarSocio = async (req, res) => {
  const { id } = req.params;
  try {
    const socioEliminado = await Socio.findByIdAndDelete(id);
    if (!socioEliminado) {
      return res.status(404).json({ message: 'Socio no encontrado para eliminar' });
    }
    res.json({ message: 'Socio eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  obtenerSocios,
  obtenerSocioPorId,
  crearSocio,
  actualizarSocio,
  eliminarSocio,
};
