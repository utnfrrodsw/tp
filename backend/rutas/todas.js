const router = require('express').Router()

router.get('/status',function (req, res) {
    res.status(200).json({ status: "UP" });
})

const usuarioRouter = require('./usuario');
const permisoRouter = require('./permiso');

router.use('/usuarios', usuarioRouter);
router.use('/permisos', permisoRouter);

module.exports = router