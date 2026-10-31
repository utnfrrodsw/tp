const express = require('express');
const router = express.Router();
const {
  getEspecialidades,
  getEspecialidadByPk,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad
} = require('../controllers/especialidadController');
const { authenticate, authorize } = require('../middlewares/auth');

// Cualquier usuario logueado puede consultar; solo el admin puede modificar
router.use(authenticate);
const soloAdmin = authorize('admin');

router.get('/', getEspecialidades);
router.get('/:id', getEspecialidadByPk);
router.post('/', soloAdmin, createEspecialidad);
router.put('/:id', soloAdmin, updateEspecialidad);
router.delete('/:id', soloAdmin, deleteEspecialidad);

module.exports = router;
