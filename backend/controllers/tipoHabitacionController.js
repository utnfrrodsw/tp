const TipoHabitacion = require('../models/tipoHabitacion');
const Habitacion = require('../models/habitacion');

const obtenerTodosTipos = async (req, res) => {
  try {
    const tiposHabitacion = await TipoHabitacion.find({}, { _id: 0, __v: 0 }).select('id denominacion');
    return res.json(tiposHabitacion);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const obtenerTipoPorId = async (req, res) => {
  try {
    const tipo = await TipoHabitacion.findOne({ id: req.params.id }, { _id: 0, __v: 0 });
    if (!tipo) {
      return res.status(404).json({ message: "Tipo de habitación no encontrado" });
    }
    return res.json(tipo);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



const crearTipo = async (req, res) => {
  const tipo = new TipoHabitacion(req.body);
  try {
    const nuevoTipo = await tipo.save();
    res.status(201).json(nuevoTipo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const actualizarTipo = async (req, res) => {
  try {
    const tipo = await TipoHabitacion.findOneAndUpdate(
      { id: req.params.id }, 
      req.body,
      { new: true }
    );
    if (!tipo) return res.status(404).json({ message: "Tipo de habitación no encontrado" });
    res.json(tipo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const eliminarTipo = async (req, res) => {
  try {
    
    const habitacion = await Habitacion.findOne({ idTipo: req.params.id });
    if (habitacion) {
      return res.status(400).json({ message: "No se puede eliminar el tipo de habitación porque hay habitaciones que lo están utilizando" });
    }

    
    const tipo = await TipoHabitacion.findOneAndDelete({ id: req.params.id });
    if (!tipo) return res.status(404).json({ message: "Tipo de habitación no encontrado" });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  obtenerTodosTipos,
  obtenerTipoPorId,
  crearTipo,
  actualizarTipo,
  eliminarTipo
};
