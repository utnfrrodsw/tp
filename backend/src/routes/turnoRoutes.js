const { Router } = require('express');
const {
  getTurnos,
  getPlantillas,
  getTurnoById,
  createTurno,
  updateTurno,
  deleteTurno,
  getInscripcionesTurno
} = require('../controllers/turnoController');
const {
  getTiposClase,
  getTipoClaseById,
  createTipoClase,
  updateTipoClase,
  deleteTipoClase
} = require('../controllers/tipoClaseController');
const { inscribirse, cancelarInscripcion } = require('../controllers/inscripcionTurnoController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = Router();
const soloAdmin = authorize('admin');
const adminOProfesor = authorize('admin', 'profesor');

router.use(authenticate);

router.get('/tipos-clase', getTiposClase);
router.get('/tipos-clase/:id', getTipoClaseById);
router.post('/tipos-clase', soloAdmin, createTipoClase);
router.put('/tipos-clase/:id', soloAdmin, updateTipoClase);
router.delete('/tipos-clase/:id', soloAdmin, deleteTipoClase);

router.get('/plantillas', soloAdmin, getPlantillas);
router.get('/', getTurnos);
router.get('/:id/inscripciones', adminOProfesor, getInscripcionesTurno);
router.post('/:id/inscripciones', authorize('cliente'), inscribirse);
router.delete('/:id/inscripciones', authorize('cliente'), cancelarInscripcion);
router.get('/:id', getTurnoById);
router.post('/', soloAdmin, createTurno);
router.put('/:id', soloAdmin, updateTurno);
router.delete('/:id', soloAdmin, deleteTurno);

module.exports = router;
