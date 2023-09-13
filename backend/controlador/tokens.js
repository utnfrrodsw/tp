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
	Promise.all([usuarioDao.findById(req.session.usuarioID),usuarioDao.findById(req.body.amigoID)])
        .then(usuarios=>{
            let [emisor,receptor]=usuarios;
						if(emisor.permisos.some(per=>per.ID==3)) // ¿ Ver cómo tr
							return tokensDao.enviar(emisor,receptor,req.body.cantidad);
						else{
							let error=new Error("No tiene los permisos necesarios.");
							error.name=403
							throw error;
						}
				})
				.then((data) => {
						res.send(data);
				})
				.catch((error) => {
						res.status(error.name).send(error.message);
				});
}

module.exports = tokensController;