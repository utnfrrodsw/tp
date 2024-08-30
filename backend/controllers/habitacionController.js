const Habitacion = require('../models/habitacion');
const mongoose = require('mongoose');
const TipoHabitacion = require('../models/tipoHabitacion');
const Estadia = require('../models/estadia');
const Localidad = require('../models/localidad');
const HabitacionLocalidad = require('../models/habitacionLocalidad');

const obtenerHabitacionesDisponibles = async (req, res) => {
  try {
    // Desestructuramos los parámetros que vienen de la ruta
    const { fechaIngreso, fechaEgreso, capacidad, idLoc } = req.params;

    // Verificamos que idLoc es un número entero
    const idLocalidad =idLoc;
    
    if (isNaN(idLocalidad)) {
      return res.status(400).json({ error: 'ID de localidad inválido' });
    }

    // Función para convertir fechas del formato DD-MM-AAAA a un objeto Date en JavaScript
    const parseDate = (fecha) => {
      const [day, month, year] = fecha.split('-').map(num => parseInt(num, 10));
      return new Date(Date.UTC(year, month - 1, day));  // Usamos Date.UTC para manejar la fecha en UTC
    };

    // Convertimos las fechas de ingreso y egreso usando parseDate
    const fechaIngresoDate = parseDate(fechaIngreso);
    const fechaEgresoDate = parseDate(fechaEgreso);

    // Validamos si las fechas se han convertido correctamente
    if (isNaN(fechaIngresoDate.getTime()) || isNaN(fechaEgresoDate.getTime())) {
      return res.status(400).json({ error: 'Fechas inválidas' });
    }

    // Obtenemos todas las estadías que se superponen con el rango de fechas dado
    const estadiasSuperpuestas = await Estadia.find({
      $or: [
        {
          fechaIngreso: { $lt: fechaEgresoDate },  // fechaIngreso de la estadía es antes de la fechaEgreso solicitada
          fechaEgreso: { $gt: fechaIngresoDate }   // fechaEgreso de la estadía es después de la fechaIngreso solicitada
        },
        {
          fechaIngreso: { $gte: fechaIngresoDate, $lte: fechaEgresoDate }  // fechaIngreso de la estadía está dentro del rango solicitado
        }
      ]
    });

    // Obtenemos los números de habitaciones ocupadas
    const habitacionesOcupadas = estadiasSuperpuestas.map(estadia => estadia.nroHabitacion);

    // Obtenemos todas las habitaciones en la localidad específica
    const habitacionesEnLocalidad = await HabitacionLocalidad.find({ idLocalidad: idLocalidad });
    const habitacionesEnLocalidadIds = habitacionesEnLocalidad.map(habitacionLocalidad => habitacionLocalidad.nroHabitacion);

    // Buscamos habitaciones disponibles que coincidan con la capacidad, no estén ocupadas y pertenezcan a la localidad especificada
    const habitacionesDisponibles = await Habitacion.find({
      nroHabitacion: { $nin: habitacionesOcupadas, $in: habitacionesEnLocalidadIds },  // Filtramos por localidad y que no estén ocupadas
      capacidadPersonas: { $gte: parseInt(capacidad, 10) }
    });

    // Respondemos con las habitaciones disponibles
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
