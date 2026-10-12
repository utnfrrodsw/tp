const express = require('express');
const router = express.Router();
const {
  getClientes,
  getClienteByDni,
  createCliente,
  crearCuentaCliente,
  updateCliente,
  deleteCliente
} = require('../controllers/clienteController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);
const soloAdmin = authorize('admin');
// Los profesores necesitan ver los clientes (por ej. para asignarles rutinas); los clientes no
// pueden ver los datos de otros clientes
const adminOProfesor = authorize('admin', 'profesor');

router.get('/', adminOProfesor, getClientes);
router.get('/:dni', adminOProfesor, getClienteByDni);
router.post('/', soloAdmin, createCliente);
router.put('/:dni', soloAdmin, updateCliente);
router.delete('/:dni', soloAdmin, deleteCliente);

// cuenta de acceso del cliente (contraseña inicial: su DNI)
router.post('/:dni/cuenta', soloAdmin, crearCuentaCliente);

module.exports = router;
