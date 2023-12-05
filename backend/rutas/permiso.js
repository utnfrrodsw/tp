const router = require('express').Router()
const permisoController = require('../controlador/permiso');

router.get('/',permisoController.findPermisos)

module.exports = router