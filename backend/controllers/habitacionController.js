const Habitacion = require('../models/habitacion');
const mongoose = require('mongoose');
const TipoHabitacion = require('../models/tipoHabitacion');
const Estadia = require('../models/estadia');


const obtenerHabitacionesDisponibles = async (req, res) => {
  try {
    const { fechaIngreso, fechaEgreso, capacidad } = req.params;

    
    const parseDate = (fecha) => {
      const [day, month, year] = fecha.split('-').map(num => parseInt(num, 10));
      return new Date(year, month - 1, day);
    };

    const fechaIngresoDate = parseDate(fechaIngreso);
    const fechaEgresoDate = parseDate(fechaEgreso);

    if (isNaN(fechaIngresoDate) || isNaN(fechaEgresoDate)) {
      return res.status(400).json({ error: 'Fechas inválidas' });
    }

    
    const estadiasSuperpuestas = await Estadia.find({
      $or: [
        {
          fechaIngreso: { $lt: fechaEgresoDate },
          fechaEgreso: { $gt: fechaIngresoDate }
        },
        {
          fechaIngreso: { $gte: fechaIngresoDate, $lte: fechaEgresoDate }
        }
      ]
    });

    
    const habitacionesOcupadas = estadiasSuperpuestas.map(estadia => estadia.nroHabitacion);

    
    const habitacionesDisponibles = await Habitacion.find({
      nroHabitacion: { $nin: habitacionesOcupadas },
      capacidadPersonas: { $gte: parseInt(capacidad, 10) }
    });

    res.json(habitacionesDisponibles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las habitaciones disponibles.", error: error.message });
  }
};


const obtenerTodasHabitaciones = async (req, res) => {
  try {
    const habitaciones = await Habitacion.find();
    const habitacionesConDenominacion = await Promise.all(habitaciones.map(async habitacion => {
      
      const tipoHabitacion = await TipoHabitacion.findOne({ id: habitacion.idTipo.toString() });
      return {
       
        nroHabitacion: habitacion.nroHabitacion,
        tipo: tipoHabitacion ? tipoHabitacion.denominacion : null, 
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
    
    const tipoHabitacion = await TipoHabitacion.findOne({ id: habitacion.idTipo.toString() });
    const habitacionConDenominacion = {
    
      nroHabitacion: habitacion.nroHabitacion,
      tipo: tipoHabitacion ? tipoHabitacion.denominacion : null, 
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
      { nroHabitacion: req.params.id.toString() }, 
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
  obtenerHabitacionesDisponibles,
  obtenerTodasHabitaciones,
  obtenerHabitacionPorNroHabitacion,
  crearHabitacion,
  actualizarHabitacion,
  eliminarHabitacion
};
