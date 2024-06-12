const Estadia = require('../models/estadia');
const Cliente = require('../models/cliente');
const Habitacion = require('../models/habitacion');
const moment = require('moment-timezone'); 


const realizarCheckin = async (req, res) => {
  try {
    const idEstadia = req.params.idEstadia;

    // Buscar la estadia por idEst
    const estadia = await Estadia.findOneAndUpdate(
      { idEst: idEstadia },
      { estado: 'Activo' }, // Actualizar estado a 'Activo' para realizar el check-in
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


const realizarCheckout = async (req, res) => {
  try {
    const idEstadia = req.params.idEstadia;

    // Buscar la estadia por idEst
    const estadia = await Estadia.findOneAndUpdate(
      { idEst: idEstadia },
      { estado: 'Finalizado' }, // Actualizar estado a 'Finalizado' para realizar el checkout
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


const crearEstadia = async (req, res) => {
  try {
    const { idEst, fechaIngreso, fechaEgreso, estado, nroDni, nroHabitacion } = req.body;

    // Buscar cliente por nroDni para obtener el idCli
    const cliente = await Cliente.findOne({ nroDni });
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Formatear las fechas desde DD-MM-AAAA a AAAA-MM-DD para MongoDB
    const fechaIngresoFormatted = moment(fechaIngreso, 'DD-MM-YYYY').format('YYYY-MM-DD');
    const fechaEgresoFormatted = moment(fechaEgreso, 'DD-MM-YYYY').format('YYYY-MM-DD');

    // Crear la estadia con los datos formateados y el idCli encontrado
    const estadia = new Estadia({
      idEst,
      fechaIngreso: new Date(fechaIngresoFormatted),
      fechaEgreso: new Date(fechaEgresoFormatted),
      estado,
      idCli: cliente.idCli,
      nroHabitacion
    });

    await estadia.save();

    res.status(201).json(estadia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



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
        const estadias = await Estadia.find();

        const estadiasConDatosCompletos = await Promise.all(estadias.map(async estadia => {
            // Buscar la habitación correspondiente a la estadia por su idEst
            const habitacion = await Habitacion.findOne({ nroHabitacion: estadia.nroHabitacion });

            // Buscar el cliente correspondiente a la estadia por su idCli
            const cliente = await Cliente.findOne({ idCli: estadia.idCli });

            // Formatear las fechas usando Moment.js con el formato requerido y zona horaria correcta
            return {
                idEst: estadia.idEst,
                nroHabitacion: estadia.nroHabitacion,
                fechaIngreso: estadia.fechaIngreso,
                fechaEgreso: estadia.fechaEgreso,
                estado: estadia.estado,
                nombreCliente: cliente ? cliente.apellidoYnombre : null,
                dniCliente: cliente ? cliente.nroDni : null
            };
        }));

        res.json(estadiasConDatosCompletos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



  
  const buscarClientePorID = async (req, res) => {
    try {
      const cliente = await Cliente.findOne({ idCli: req.params.id }); // Buscar por idCli
      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const reservarHabitacion = async (req, res) => {
    try {
      const { nroHabitacion, fechaIngreso, fechaEgreso } = req.body;
  
      // Verificar si la habitación está disponible
      const habitacion = await Habitacion.findOne({ nroHabitacion });
      if (!habitacion) {
        return res.status(404).json({ message: "Habitación no encontrada." });
      }
  
      if (habitacion.estado !== 'Disponible') {
        return res.status(400).json({ message: "La habitación ya está ocupada." });
      }
  
      // Verificar si el cliente está autenticado
      if (!req.cliente || !req.cliente.idCli) {
        return res.status(401).json({ message: "Cliente no autenticado o falta idCli." });
      }
  
      const clienteId = req.cliente.idCli;
  
      // Formatear las fechas usando Moment.js
      const fechaIngresoFormatted = moment(fechaIngreso, 'DD-MM-YYYY').toISOString();
      const fechaEgresoFormatted = moment(fechaEgreso, 'DD-MM-YYYY').toISOString();
  
      // Obtener el idEst secuencial
      const ultimaEstadia = await Estadia.findOne().sort({ idEst: -1 });
      const nuevoIdEst = ultimaEstadia ? ultimaEstadia.idEst + 1 : 1;
  
      // Crear la nueva estadia
      const nuevaEstadia = new Estadia({
        idEst: nuevoIdEst,
        idCli: clienteId,
        nroHabitacion,
        fechaIngreso: new Date(fechaIngresoFormatted),
        fechaEgreso: new Date(fechaEgresoFormatted),
        estado: 'Reservado'
      });
  
      // Guardar la nueva estadia en la base de datos
      await nuevaEstadia.save();
  
      // Actualizar el estado de la habitación a Ocupada
      habitacion.estado = 'Ocupada';
      await habitacion.save();
  
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
  buscarClientePorID ,
  obtenerTodasEstadias,
  crearEstadia,
  obtenerEstadiaPorId,
  actualizarEstadia,
  eliminarEstadia
};
