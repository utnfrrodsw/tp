const Localidad = require('../models/localidad');
const Provincia = require('../models/provincia');

const crearLocalidad = async (req, res) => {
    const { idLocalidad, nombre, idProvincia } = req.body;
  
    try {
      const nuevaLocalidad = new Localidad({
        idLocalidad,
        nombre,
        idProvincia
      });
  
      await nuevaLocalidad.save();
  
      res.status(201).json(nuevaLocalidad);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

const obtenerTodasLocalidades = async (req, res) => {
    try {
      const localidades = await Localidad.find();
      res.json(localidades);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const obtenerLocalidadPorId = async (req, res) => {
    const idLocalidad = parseInt(req.params.id, 10);
    try {
      const localidad = await Localidad.findOne({ idLocalidad });
      if (!localidad) {
        return res.status(404).json({ message: 'Localidad no encontrada.' });
      }
      res.json(localidad);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  

  const actualizarLocalidad = async (req, res) => {
    const { idLocalidad } = req.params;
    const { nombre, idProvincia } = req.body;
    try {
      const localidad = await Localidad.findOneAndUpdate({ idLocalidad }, { nombre, idProvincia }, { new: true });
      if (!localidad) {
        return res.status(404).json({ message: 'Localidad no encontrada.' });
      }
      res.json(localidad);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

  const eliminarLocalidad = async (req, res) => {
    const { id } = req.params;
    try {
      const localidad = await Localidad.findByIdAndDelete(id);
      if (!localidad) {
        return res.status(404).json({ message: 'Localidad no encontrada.' });
      }
      res.json({ message: 'Localidad eliminada correctamente.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const obtenerLocalidadPorNombre = async (req, res) => {
    try {
      
      const {nombre} = req.params;
  
      
      const localidad = await Localidad.findOne({ nombre: { $regex: new RegExp(`^${nombre}$`, 'i') } });
  
      if (!localidad) {
        return res.status(404).json({ error: 'Localidad no encontrada' });
      }
  
      
      res.json(localidad);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener la localidad.", error: error.message });
    }
  };


  const obtenerLocalidadYProvincia = async (req, res) => {
    const { nombreLocalidad, nombreProvincia } = req.params;

    try {
        const localidad = await Localidad.findOne({ nombre: { $regex: new RegExp(`^${nombreLocalidad}$`, 'i') } });
        if (!localidad) {
            return res.status(404).json({ message: 'Localidad no encontrada.' });
        }

        const provincia = await Provincia.findOne({ nombre: { $regex: new RegExp(`^${nombreProvincia}$`, 'i') } });
        if (!provincia) {
            return res.status(404).json({ message: 'Provincia no encontrada.' });
        }

        res.json({
            localidad,
            provincia
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los datos.", error: error.message });
    }
};


module.exports = { crearLocalidad,
                   actualizarLocalidad,
                   obtenerLocalidadPorId,
                   obtenerTodasLocalidades, 
                   eliminarLocalidad,obtenerLocalidadPorNombre,obtenerLocalidadYProvincia};
