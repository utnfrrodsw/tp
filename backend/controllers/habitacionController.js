const Habitacion = require('../models/habitacion');
const mongoose = require('mongoose');
const TipoHabitacion = require('../models/tipoHabitacion');

const obtenerTodasHabitaciones = async (req, res) => {
  try {
    const habitaciones = await Habitacion.find();
    const habitacionesConDenominacion = await Promise.all(habitaciones.map(async habitacion => {
      // Buscar el tipo de habitación por su campo "id"
      const tipoHabitacion = await TipoHabitacion.findOne({ id: habitacion.idTipo.toString() });
      return {
       
        nroHabitacion: habitacion.nroHabitacion,
        tipo: tipoHabitacion ? tipoHabitacion.denominacion : null, // Utilizar la denominación en lugar del ID
        descripcion: habitacion.descripcion,
        estado: habitacion.estado,
        foto: habitacion.foto,
        capacidadPersonas: habitacion.capacidadPersonas,
        precioXdia: habitacion.precioXdia,
        
      };
    }));
    res.json(habitacionesConDenominacion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const obtenerHabitacionPorNroHabitacion = async (req, res) => {
  try {
    const habitacion = await Habitacion.findOne({ nroHabitacion: req.params.id });
    if (!habitacion) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }
    // Buscar el tipo de habitación por su campo "id"
    const tipoHabitacion = await TipoHabitacion.findOne({ id: habitacion.idTipo.toString() });
    const habitacionConDenominacion = {
    
      nroHabitacion: habitacion.nroHabitacion,
      tipo: tipoHabitacion ? tipoHabitacion.denominacion : null, // Utilizar la denominación en lugar del ID
      descripcion: habitacion.descripcion,
      estado: habitacion.estado,
      foto: habitacion.foto,
      capacidadPersonas: habitacion.capacidadPersonas,
      precioXdia: habitacion.precioXdia,
      
    };
    res.json(habitacionConDenominacion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const crearHabitacion = async (req, res) => {
 
  const nuevaHabitacion = new Habitacion(req.body);
  try {
    const habitacionCreada = await nuevaHabitacion.save();
    res.status(201).json(habitacionCreada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const actualizarHabitacion = async (req, res) => {
  try {
    const habitacion = await Habitacion.findOneAndUpdate(
      { nroHabitacion: req.params.id.toString() }, // Convertir a cadena
      req.body,
      { new: true }
    );
    if (!habitacion) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }
    res.json(habitacion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




const eliminarHabitacion = async (req, res) => {
  try {
    const habitacion = await Habitacion.findOneAndDelete({ nroHabitacion: req.params.id });
    if (!habitacion) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  obtenerTodasHabitaciones,
  obtenerHabitacionPorNroHabitacion,
  crearHabitacion,
  actualizarHabitacion,
  eliminarHabitacion
};
