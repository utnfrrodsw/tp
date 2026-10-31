const express = require('express');
const router = express.Router();
const {
  getClientes,
  getMiPerfil,
  updateMiPerfil,
  getClienteByDni,
  createCliente,

  updateCliente,
  deleteCliente
} = require('../controllers/clienteController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);
const soloAdmin = authorize('admin');
// Los profesores necesitan ver los clientes (por ej. para asignarles rutinas); los clientes no
// pueden ver los datos de otros clientes
const adminOProfesor = authorize('admin', 'profesor');

// Los clientes solo acceden a su propio perfil. Tiene que ir antes que /:dni
router.get('/me', authorize('cliente'), getMiPerfil);
router.put('/me', authorize('cliente'), updateMiPerfil);

router.get('/', adminOProfesor, getClientes);
router.get('/:dni', adminOProfesor, getClienteByDni);
router.post('/', soloAdmin, createCliente);
router.put('/:dni', soloAdmin, updateCliente);
router.delete('/:dni', soloAdmin, deleteCliente);

module.exports = router;
