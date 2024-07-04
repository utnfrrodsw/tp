const EstadiaServicio = require('../models/estadiaServicio');
const Servicio = require('../models/servicio');

const crearEstadiaServicio = async (req, res) => {
  const { idServicio, idEstadia } = req.body;
  try {
    const nuevoEstadiaServicio = new EstadiaServicio({ idServicio, idEstadia });
    await nuevoEstadiaServicio.save();
    res.status(201).json(nuevoEstadiaServicio);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const obtenerTodasEstadiaServicios = async (req, res) => {
  try {
    const estadiaServicios = await EstadiaServicio.find();
    res.json(estadiaServicios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const eliminarEstadiaServicio = async (req, res) => {
  const { idServicio, idEstadia } = req.params;
  try {
    const estadiaServicio = await EstadiaServicio.findOneAndDelete({ idServicio, idEstadia });
    if (!estadiaServicio) {
      return res.status(404).json({ message: 'El servicio para esa estadia no se encontro' });
    }
    res.json({ message: 'El servicio para esa estadia fue eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const obtenerServiciosPorEstadia = async (req, res) => {
  const { idEstadia } = req.params;
  try {
    const estadiaServicios = await EstadiaServicio.find({ idEstadia });
    const serviciosIds = estadiaServicios.map(es => es.idServicio);
    
    const servicios = await Servicio.find({ idServ: { $in: serviciosIds } });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { crearEstadiaServicio, obtenerTodasEstadiaServicios, eliminarEstadiaServicio, obtenerServiciosPorEstadia };
