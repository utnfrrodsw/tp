const Servicio = require('../models/servicio');

// Obtener todos los servicios
const obtenerTodosServicios = async (req, res) => {
  try {
    const servicios = await Servicio.find();
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const obtenerServicioPorId = async (req, res) => {
    const { id } = req.params;
    try {
      const servicio = await Servicio.findOne({ idServ: id });
      if (!servicio) {
        return res.status(404).json({ message: 'Servicio no encontrado.' });
      }
      res.json(servicio);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

const crearServicio = async (req, res) => {
    const { nombre, descripcion, precio } = req.body;
    try {
      let idServ;
  
      // Buscar el último servicio para determinar el idServ siguiente
      const ultimoServicio = await Servicio.findOne().sort({ idServ: -1 });
  
      if (ultimoServicio) {
        idServ = ultimoServicio.idServ + 1;
      } else {
        // Si no hay servicios en la base de datos, asignar idServ como 1
        idServ = 1;
      }
  
      const nuevoServicio = new Servicio({ idServ, nombre, descripcion, precio });
      await nuevoServicio.save();
      res.status(201).json(nuevoServicio);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

  const actualizarServicio = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio } = req.body;
    try {
      const servicio = await Servicio.findOneAndUpdate({ idServ: id }, { nombre, descripcion, precio }, { new: true });
      if (!servicio) {
        return res.status(404).json({ message: 'Servicio no encontrado.' });
      }
      res.json(servicio);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

  const eliminarServicio = async (req, res) => {
    const { id } = req.params;
    try {
      const servicio = await Servicio.findOneAndDelete({ idServ: id });
      if (!servicio) {
        return res.status(404).json({ message: 'Servicio no encontrado.' });
      }
      res.json({ message: 'Servicio eliminado correctamente.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

module.exports = {
  obtenerTodosServicios,
  obtenerServicioPorId,
  crearServicio,
  actualizarServicio,
  eliminarServicio
};
