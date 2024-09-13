const Estadia = require('../models/estadia');
const Cliente = require('../models/cliente');
const Habitacion = require('../models/habitacion');
const EstadiaServicio = require('../models/estadiaServicio');
const Servicio = require('../models/servicio');
const moment = require('moment-timezone');

// Realizar Check-in
const realizarCheckin = async (req, res) => {
  try {
    const idEstadia = req.params.idEstadia;
    const estadia = await Estadia.findOneAndUpdate(
      { idEst: idEstadia },
      { estado: 'Activo' },
      { new: true }
    );

    if (!estadia) {
      return res.status(404).json({ message: "Estadia no encontrada" });
    }

    res.json(estadia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Realizar Check-out
const realizarCheckout = async (req, res) => {
  try {
    const idEstadia = req.params.idEstadia;
    const estadia = await Estadia.findOneAndUpdate(
      { idEst: idEstadia },
      { estado: 'Finalizado' },
      { new: true }
    );

    if (!estadia) {
      return res.status(404).json({ message: "Estadia no encontrada" });
    }

    const serviciosConsumidos = await EstadiaServicio.find({ idEstadia: idEstadia });
    let totalCost = 0;
    for (const consumo of serviciosConsumidos) {
      const servicio = await Servicio.findOne({ idServ: consumo.idServicio });
      if (servicio) {
        totalCost += servicio.precio;
      }
    }

    const cliente = await Cliente.findOne({ idCli: estadia.idCli });

    res.json({
      estadia,
      totalServicios: totalCost,
      cliente: {
        nroDni: cliente ? cliente.nroDni : null,
        apellidoYnombre: cliente ? cliente.apellidoYnombre : null
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const crearEstadia = async (req, res) => {
  try {
    const { idEst, fechaIngreso, fechaEgreso, estado, nroDni, nroHabitacion, idLocalidad } = req.body;
    const cliente = await Cliente.findOne({ nroDni });
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    const fechaIngresoFormatted = moment(fechaIngreso, 'DD-MM-YYYY').format('YYYY-MM-DD');
    const fechaEgresoFormatted = moment(fechaEgreso, 'DD-MM-YYYY').format('YYYY-MM-DD');

    const estadia = new Estadia({
      idEst,
      fechaIngreso: new Date(fechaIngresoFormatted),
      fechaEgreso: new Date(fechaEgresoFormatted),
      estado,
      idCli: cliente.idCli,
      nroHabitacion,
      idLocalidad // Asegúrate de agregar este campo
    });

    await estadia.save();
    res.status(201).json(estadia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener Estadia por ID
const obtenerEstadiaPorId = async (req, res) => {
  try {
    const estadia = await Estadia.findOne({ idEst: req.params.id });
    if (!estadia) {
      return res.status(404).json({ message: "Estadia no encontrada" });
    }
    const { idEst, fechaIngreso, fechaEgreso, estado } = estadia;

    const fechaIngresoFormateada = moment(fechaIngreso).format('DD-MM-YYYY');
    const fechaEgresoFormateada = moment(fechaEgreso).format('DD-MM-YYYY');

    res.json({ idEst, fechaIngreso: fechaIngresoFormateada, fechaEgreso: fechaEgresoFormateada, estado });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar Estadia
const actualizarEstadia = async (req, res) => {
  try {
    const fechaEgreso = moment(req.body.fechaEgreso, 'DD-MM-YYYY').toISOString();
    const estadia = await Estadia.findOneAndUpdate(
      { idEst: req.params.id },
      { fechaEgreso: fechaEgreso },
      { new: true }
    );

    if (!estadia) {
      return res.status(404).json({ message: "Estadia no encontrada" });
    }

    res.json(estadia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar Estadia
const eliminarEstadia = async (req, res) => {
  try {
    const estadia = await Estadia.findOneAndDelete({ idEst: req.params.id });
    if (!estadia) {
      return res.status(404).json({ message: "Estadia no encontrada" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const obtenerTodasEstadias = async (req, res) => {
  try {
    const estadias = await Estadia.find(); // Obtener todas las estadías
    res.status(200).json(estadias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las estadías.", error: error.message });
  }
};

// Buscar Cliente por ID
const buscarClientePorID = async (req, res) => {
  try {
    const cliente = await Cliente.findOne({ idCli: req.params.id });
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reservar Habitación
const reservarHabitacion = async (req, res) => {
  try {
    const { nroHabitacion, fechaIngreso, fechaEgreso, idLocalidad } = req.body;

    // Verificar si la habitación existe
    const habitacion = await Habitacion.findOne({ nroHabitacion });
    if (!habitacion) {
      return res.status(404).json({ message: "Habitación no encontrada." });
    }

    // Verificar si la habitación está disponible
    if (habitacion.estado !== 'Disponible') {
      return res.status(400).json({ message: "La habitación ya está ocupada." });
    }

    // Verificar si el cliente está autenticado
    if (!req.cliente || !req.cliente.idCli) {
      return res.status(401).json({ message: "Cliente no autenticado." });
    }

    const clienteId = req.cliente.idCli;

    // Formatear fechas
    const fechaIngresoFormatted = moment(fechaIngreso, 'DD-MM-YYYY').toISOString();
    const fechaEgresoFormatted = moment(fechaEgreso, 'DD-MM-YYYY').toISOString();

    // Obtener el último ID de estadía y calcular el nuevo ID
    const ultimaEstadia = await Estadia.findOne().sort({ idEst: -1 });
    const nuevoIdEst = ultimaEstadia ? ultimaEstadia.idEst + 1 : 1;

    // Crear nueva estadía
    const nuevaEstadia = new Estadia({
      idEst: nuevoIdEst,
      idCli: clienteId,
      nroHabitacion,
      fechaIngreso: new Date(fechaIngresoFormatted),
      fechaEgreso: new Date(fechaEgresoFormatted),
      estado: 'Reservado',
      idLocalidad // Asegúrate de incluir este campo
    });

    // Guardar la estadía
    await nuevaEstadia.save();
    res.status(201).json(nuevaEstadia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al reservar la habitación.", error: error.message });
  }
};


module.exports = {
  reservarHabitacion,
  realizarCheckout,
  realizarCheckin,
  buscarClientePorID,
  obtenerTodasEstadias,
  crearEstadia,
  obtenerEstadiaPorId,
  actualizarEstadia,
  eliminarEstadia
};
