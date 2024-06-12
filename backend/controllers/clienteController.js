const Cliente = require('../models/cliente');
const moment = require('moment');

const obtenerTodosLosClientes = async (req, res) => {
    try {
      const clientes = await Cliente.find();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

const crearCliente = async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    await cliente.save();
    res.status(201).json(cliente);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const buscarClientePorDNI = async (req, res) => {
  try {
    const cliente = await Cliente.findOne({ nroDni: req.params.dni });
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

  const actualizarCliente = async (req, res) => {
    try {
      
      const id = req.params.id.split('=')[1]; 
  
    
      if (req.body.fechaNac) {
        const fecha = moment(req.body.fechaNac, 'DD-MM-YYYY');
        if (fecha.isValid()) {
          req.body.fechaNac = fecha.toISOString();
        } else {
          return res.status(400).json({ message: "Formato de fecha inválido. Debe ser DD-MM-YYYY." });
        }
      }
  
      const cliente = await Cliente.findOneAndUpdate(
        { idCli: Number(id) },  
        req.body,
        { new: true }
      );
      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }
      res.json(cliente);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  const eliminarCliente = async (req, res) => {
    try {
      
      const id = req.params.id.split('=')[1]; 
  
      const cliente = await Cliente.findOneAndDelete({ idCli: Number(id) }); 
      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  

module.exports = {
  crearCliente,
  buscarClientePorDNI,
  buscarClientePorID,
  actualizarCliente,
  eliminarCliente,
  obtenerTodosLosClientes,
};
