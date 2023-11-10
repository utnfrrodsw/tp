const express = require('express');
const router = express.Router();

const especialidadesController = require('../controllers/especialidadesController.js');

router.put('agregarEspecialidad/:idUsuario', especialidadesController.addEspecialidad);

module.exports = router;