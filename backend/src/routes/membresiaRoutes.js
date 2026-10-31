const { Router } = require('express');
const {
  getMembresias,
  getMembresiaById,
  getMembresiasByCliente,
  createMembresia,
  updateMembresia,
  deleteMembresia
} = require('../controllers/membresiaController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

const soloAdmin = authorize('admin');
// Las membresías las ve el admin y cada cliente las suyas (el controller filtra). El profesor no
const adminOCliente = authorize('admin', 'cliente');

router.get('/', adminOCliente, getMembresias);
router.get('/cliente/:dni', soloAdmin, getMembresiasByCliente);
router.get('/:id', adminOCliente, getMembresiaById);

router.post('/', soloAdmin, createMembresia);
router.put('/:id', soloAdmin, updateMembresia);
router.delete('/:id', soloAdmin, deleteMembresia);

module.exports = router;
