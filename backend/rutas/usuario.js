const router = require('express').Router()
const usuarioController = require('../controlador/usuario');

// * https://medium.com/techno101/crud-using-node-js-express-and-sequelize-82c10ef3b346

router.get('/actual',(req,res)=>{
	req.params={id:req.session.usuarioID};
	return usuarioController.findUsuarioById(req,res);
})

router.post('/',usuarioController.addUsuario)

router.post('/invitacion/:id',usuarioController.invitar)

router.delete('/invitacion/:id',usuarioController.eliminarInvitacion)

router.delete('/amigo/:id',usuarioController.eliminarAmigo)

router.patch('/invitacion/:id',usuarioController.aceptarInvitacion)

router.delete('/:id',usuarioController.deleteById)

router.put('/:id',usuarioController.updateUsuario)

router.post('/:id/habilitado',usuarioController.cambiarHabilitado)

router.get('/',usuarioController.findUsuarios)

router.get('/:id',usuarioController.findUsuarioById)

router.get('/buscar/:query',usuarioController.findUsuariosFuzzilyByName)

router.post('/ingresar',usuarioController.ingresar)

router.post('/salir',usuarioController.salir)

module.exports = router