const { Router } = require('express');
const {
  getRutinas,
  getRutinaById,
  createRutina,
  updateRutina,
  deleteRutina,
  createEjercicio,
  updateEjercicio,
  deleteEjercicio
} = require('../controllers/rutinaController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/', getRutinas);
router.get('/:id', getRutinaById);
router.post('/', authorize('admin', 'profesor'), createRutina);
router.put('/:id', authorize('admin', 'profesor'), updateRutina);
router.delete('/:id', authorize('admin', 'profesor'), deleteRutina);
router.post('/:id/ejercicios', authorize('admin', 'profesor'), createEjercicio);
router.put('/:id/ejercicios/:idEjercicio', authorize('admin', 'profesor'), updateEjercicio);
router.delete('/:id/ejercicios/:idEjercicio', authorize('admin', 'profesor'), deleteEjercicio);

module.exports = router;
