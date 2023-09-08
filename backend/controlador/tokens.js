const tokensDao = require('../dao/tokens');
const usuarioDao = require('../dao/usuario');
var tokensController = {
    obtenerCantidadCirculando
		,generar
		,enviar
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

function enviar(req, res) {
	console.log(req.session.usuarioID,req.body.amigoID);
	Promise.all([usuarioDao.findById(req.session.usuarioID),usuarioDao.findById(req.body.amigoID)])
        .then(usuarios=>{
            let [emisor,receptor]=usuarios;
						return tokensDao.enviar(emisor,receptor,req.body.cantidad);
				})
				.then((data) => {
						res.send(data);
				})
				.catch((error) => {
						console.log(error);
				});
}

module.exports = tokensController;