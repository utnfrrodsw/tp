const HabitacionLocalidad = require('../models/habitacionLocalidad');
const Habitacion = require('../models/habitacion');

const crearHabitacionLocalidad = async (req, res) => {
  const { nroHabitacion, idLocalidad } = req.body; 
  try {
    const nuevaRelacion = new HabitacionLocalidad({ nroHabitacion, idLocalidad });
    await nuevaRelacion.save();
    res.status(201).json(nuevaRelacion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const obtenerTodasHabitacionesLocalidad = async (req, res) => {
  try {
    const relaciones = await HabitacionLocalidad.find();
    res.json(relaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const eliminarHabitacionLocalidad = async (req, res) => {
  const { id } = req.params;
  try {
    const relacion = await HabitacionLocalidad.findOneAndDelete({ _id: id });
    if (!relacion) {
      return res.status(404).json({ message: 'Relación HabitacionLocalidad no encontrada.' });
    }
    res.json({ message: 'Relación HabitacionLocalidad eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const actualizarHabitacionLocalidad = async (req, res) => {
  const { id } = req.params;
  const { nroHabitacion, idLocalidad } = req.body; 
  try {
    const nuevaRelacion = { nroHabitacion, idLocalidad };
    const relacionActualizada = await HabitacionLocalidad.findOneAndUpdate({ _id: id }, nuevaRelacion, { new: true });
    if (!relacionActualizada) {
      return res.status(404).json({ message: 'Relación HabitacionLocalidad no encontrada.' });
    }
    res.json(relacionActualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const obtenerHabitacionesPorLocalidad = async (req, res) => {
  const { idLocalidad } = req.params; 
  try {
    const habitaciones = await HabitacionLocalidad.find({ idLocalidad });
    res.json(habitaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  crearHabitacionLocalidad,
  obtenerTodasHabitacionesLocalidad,
  eliminarHabitacionLocalidad,
  actualizarHabitacionLocalidad,
  obtenerHabitacionesPorLocalidad 
};
