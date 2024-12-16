const Provincia = require('../models/provincia');


const obtenerTodasProvincias = async (req, res) => {
  try {
    const provincias = await Provincia.find();
    res.json(provincias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const crearProvincia = async (req, res) => {
  const { idProvincia, nombre } = req.body;
  try {
    const nuevaProvincia = new Provincia({ idProvincia, nombre });
    await nuevaProvincia.save();
    res.status(201).json(nuevaProvincia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const obtenerProvinciaPorId = async (req, res) => {
    const { id } = req.params;
    try {
      const provincia = await Provincia.findOne({ idProvincia: id });
      if (!provincia) {
        return res.status(404).json({ message: 'Provincia no encontrada.' });
      }
      res.json(provincia);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  


  const actualizarProvincia = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
      const provincia = await Provincia.findOneAndUpdate(
        { idProvincia: id },
        { nombre },
        { new: true }
      );
      if (!provincia) {
        return res.status(404).json({ message: 'Provincia no encontrada.' });
      }
      res.json(provincia);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };


const eliminarProvincia = async (req, res) => {
    const { id } = req.params;
    try {
      const provincia = await Provincia.findOneAndDelete({ idProvincia: id });
      if (!provincia) {
        return res.status(404).json({ message: 'Provincia no encontrada.' });
      }
      res.json({ message: 'Provincia eliminada correctamente.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

module.exports = {
  obtenerTodasProvincias,
  crearProvincia,
  obtenerProvinciaPorId,
  actualizarProvincia,
  eliminarProvincia
};
