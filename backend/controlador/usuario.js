const usuarioDao = require('../dao/usuario');
const bcrypt = require('bcrypt');
var usuarioController = {
    addUsuario: addUsuario,
    findUsuarios: findUsuarios,
    findUsuarioById: findUsuarioById,
    updateUsuario: updateUsuario,
    deleteById: deleteById
    ,findUsuariosFuzzilyByName
    ,cambiarHabilitado
    ,ingresar
    ,invitar
    ,eliminarInvitacion
    ,aceptarInvitacion
    ,eliminarAmigo
    ,salir
}

function addUsuario(req, res) {
    let usuario = req.body;
    usuario.habilitado=true;
    usuarioDao.create(usuario)
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            console.log(error);
        });
}

function findUsuarioById(req, res) {
    usuarioDao.findById(req.params.id)
        .then((data) => {
            if(data)
                res.send(data);
            else res.status(404).send();
        })
        .catch((error) => {
            res.status(500).send(error);
        });
}

function deleteById(req, res) {
    usuarioDao.deleteById(req.params.id).
        then((data) => {
            res.status(200).json({
                message: "Usuario deleted successfully",
                usuario: data
            })
        })
        .catch((error) => {
            console.log(error);
        });
}

function updateUsuario(req, res) {
    usuarioDao.updateUsuario(req.body, req.params.id).
        then((data) => {
            res.status(200).json({
                message: "Usuario updated successfully",
                usuario: data
            })
        })
        .catch((error) => {
            console.log(error);
        });
}

function findUsuarios(req, res) {
    usuarioDao.findAll({incluirHabilitado:req.query.incluirHabilitado!=undefined}).
        then((data) => {
            res.send(data);
        })
        .catch((error) => {
            console.log(error);
        });
}

function findUsuariosFuzzilyByName(req, res) {
    usuarioDao.findFuzzilyByName(req.params.query,req.session.usuarioID)
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            console.log(error);
        });
}

function cambiarHabilitado(req, res) {
    usuarioDao.cambiarHabilitado(req.params.id,req.body.valor)
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            console.log(error);
        });
}

function ingresar(req, res) {
    usuarioDao.findByUsername(req.body.usuario)
        .then((usuarios) => {
            for(let usuario of usuarios){
                if(bcrypt.compareSync(req.body.contrasenia, usuario.contrasenia)){
                    req.session.usuarioID=usuario.ID;
                    res.send(usuario);
                    return; // break;
                }
            }
        })
        .catch((error) => {
            res.status(500).send(error);
        });
}

function salir(req, res) {
    req.session.destroy();
    res.status(200).send();
}

function invitar(req,res){
    usuarioDao.invitar(req.session.usuarioID,req.params.id)
        .then((usuario) => {
            res.send();
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error);
        });
}

function eliminarInvitacion(req,res){
    // TODO DRY? (ala window[?'':''])
    return req.body.soyInvitador?
        cancelarInvitacion(req,res)
        :rechazarInvitacion(req,res);
    
}

function cancelarInvitacion(req,res){
    usuarioDao.eliminarInvitacion(req.session.usuarioID,req.params.id)
        .then(() => {
            res.send();
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error);
        });
}

function rechazarInvitacion(req,res){
    usuarioDao.eliminarInvitacion(req.params.id,req.session.usuarioID)
        .then(() => {
            res.send();
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error);
        });
}

function aceptarInvitacion(req,res){
    usuarioDao.aceptarInvitacion(req.session.usuarioID,req.params.id)
        .then((usuario) => {
            res.send(usuario);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error);
        });
}

function eliminarAmigo(req,res){
    usuarioDao.eliminarAmigo(req.session.usuarioID,req.params.id)
        .then((usuario) => {
            // TODO mandar explicitamente un código??
            res.send(/* usuario */);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error);
        });
    /* // TODO DRY? (ala window[?'':''])
    return req.body.soyInvitador?
        cancelarInvitacion(req,res)
        :rechazarInvitacion(req,res);
    
        usuarioDao.eliminarInvitacion(req.session.usuarioID,req.params.id)
        .then(() => {
            res.send();
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error);
        }); */
}

module.exports = usuarioController;