const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas para clientes
router.post('/', clienteController.crearCliente); 

// Rutas protegidas para empleados
router.get('/', authMiddleware.verificarAutenticacionEmpleado, clienteController.obtenerTodosLosClientes);
router.get('/dni=:dni', authMiddleware.verificarAutenticacionEmpleado, clienteController.buscarClientePorDNI);
router.get('/id=:id', clienteController.buscarClientePorID);
router.put('/:id', authMiddleware.verificarAutenticacionEmpleado, clienteController.actualizarCliente);
router.delete('/:id', authMiddleware.verificarAutenticacionEmpleado, clienteController.eliminarCliente);

module.exports = router;

