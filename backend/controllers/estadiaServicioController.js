const EstadiaServicio = require('../models/estadiaServicio');


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

module.exports = { crearEstadiaServicio };
