const express = require('express');
const router = express.Router();
const {
  getProfesor,
  getProfesorByPk,
  createProfesor,
  crearCuentaProfesor,
  updateProfesor,
  deleteProfesor,
  asignarEspecialidad,
  quitarEspecialidad
} = require('../controllers/profesorController');
const { authenticate, authorize } = require('../middlewares/auth');

// Cualquier usuario logueado puede consultar; solo el admin puede modificar
router.use(authenticate);
const soloAdmin = authorize('admin');

router.get('/', getProfesor);
router.get('/:dni', getProfesorByPk);
router.post('/', soloAdmin, createProfesor);
router.put('/:dni', soloAdmin, updateProfesor);
router.delete('/:dni', soloAdmin, deleteProfesor);

// cuenta de acceso del profesor (contraseña inicial: su DNI)
router.post('/:dni/cuenta', soloAdmin, crearCuentaProfesor);

// relación N:M Profesor-Especialidad
router.post('/:dni/especialidades', soloAdmin, asignarEspecialidad);
router.delete('/:dni/especialidades/:idEspecialidad', soloAdmin, quitarEspecialidad);

module.exports = router;
