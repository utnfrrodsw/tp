const tokensDao = require('../dao/tokens');
const usuarioDao = require('../dao/usuario');
var tokensController = {
    obtenerCantidadCirculando
		,generar
}

function obtenerCantidadCirculando(req, res) {
	usuarioDao.findById(req.session.usuarioID)
		.then(usuario=>{
			if(!usuario)
				res.status(404).send();
			else if(usuario.permisos.some((per)=>per.ID==1)){
				tokensDao.obtenerCantidadCirculando()
				.then((data) => {
							res.send(data.count.toString());
					})
					.catch((error) => {
						res.status(500).send(error);
					});
			}else res.status(403).send();
		})
}

function generar(req,res){
	usuarioDao.findById(req.session.usuarioID)
		.then(usuario=>{
			if(!usuario)
				res.status(404).send();
			else if(usuario.permisos.some((per)=>per.ID==1)){
				let cantidad = req.body.cantidad;
				tokensDao.generar(cantidad,usuario)
					.then(() => {
						res.send();
					})
					.catch((error) => {
						res.status(500).send(error);
					});
			}else res.status(403).send();
		});
}

module.exports = tokensController;