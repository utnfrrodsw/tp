const usuarioDao = require('../dao/usuario');
const bcrypt = require('bcrypt');
var usuarioController = {
    addUsuario: addUsuario,
    findUsuarios: findUsuarios,
    findUsuarioById: findUsuarioById,
    updateUsuario: updateUsuario,
    deleteById: deleteById
    ,findUsuariosFuzzilyByName
    ,cantidadDeUsuarios
    ,cambiarHabilitado
    ,ingresar
    ,invitar
    ,eliminarInvitacion
    ,aceptarInvitacion
    ,eliminarAmigo
    ,actualizarPermisos
    ,actualizarDatos

    ,salir
}

function addUsuario(req, res) {
    // * Registro. Lo puede hacer cualquiera.
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
    let eliminarUsuario=()=>{
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

    if(req.session.usuarioID==req.params.id){
        eliminarUsuario();
    }else usuarioDao.findById(req.session.usuarioID)
		.then(usuario=>{
            // TODO Refactor: Enum para los permisos
            if(!usuario.permisos.some((per)=>per.ID==2)){
                res.status(403).send();
            }else{
                eliminarUsuario();
            }
        })
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
    // ! incluirHabilitado es si incluir que habilitado=true; so true here will bring you solo habilitados, false es todos.
    // TODO Refactor: Cambiar a "soloHabilitados"
    usuarioDao.findAll({incluirHabilitado:req.query.incluirHabilitado!=undefined}).
        then((data) => {
            res.send(data);
        })
        .catch((error) => {
            console.log(error);
        });
}

function findUsuariosFuzzilyByName(req, res) {
    usuarioDao[req.query.incluirAmigos?'buscarPorNombre':'buscarNoAmigosPorNombre'](
        req.params.consulta
        ,req.session.usuarioID
        ,{
            pagina:req.query.pagina
            ,soloHabilitados:!!+req.query.soloHabilitados
        }
    )
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            console.log(error);
        });
}

function cantidadDeUsuarios(req, res) {
	usuarioDao.findById(req.session.usuarioID)
		.then(usuario=>{
            // TODO Refactor: Enum para los permisos
            if(!usuario.permisos.some((per)=>per.ID==2)){
                res.status(403).send();
            }else{
                // ! El segundo parámetro es la persona a OMITIR; o sea, el usuario actual.
                usuarioDao.buscarPorNombre(req.params.consulta,req.session.usuarioID)
                    .then((data) => {
                        res.send(Math.ceil(data.length/usuarioDao.cantidadPorPagina).toString());
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        })
}

// TODO Refactor: Unir con actualizarDatos
function cambiarHabilitado(req, res) {
	usuarioDao.findById(req.session.usuarioID)
    .then(usuario=>{
        // TODO Refactor: Enum para los permisos
        if(!usuario.permisos.some((per)=>per.ID==2)){
            res.status(403).send();
        }else{
            usuarioDao.cambiarHabilitado(req.params.id,req.body.valor)
                .then((data) => {
                    res.send(data);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        })
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
            // TODO mandar explicitamente un código??  no content
            res.send(/* usuario */);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error);
        });
}

function actualizarPermisos(req,res){
	usuarioDao.findById(req.session.usuarioID)
        .then(usuario=>{
            // TODO Refactor: Enum para los permisos
            if(!usuario.permisos.some((per)=>per.ID==2)){
                res.status(403).send();
            }else{
                usuarioDao.actualizarPermisos(req.params.id,req.body.permisos)
                    .then((data) => {
                        res.send(data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        })
}

function actualizarDatos(req,res){
    let editadoID=req.params.id;
    let dato=req.body.dato;
    let datosPosibles=[
            'nombreCompleto'
            // TODO Now: setter de contraseña, ver cómo se hace en la creación
            ,'contrasenia'
            ,'correo'
        ]
    
        // TODO Refactor: No me acuerdo como funciona el hoisting acá, pero estaría bueno que semánticamente esta función vaya después de los chequeos de abajo. Lo mismo más arriba con los permisos o de donde sea que saqué parte del algoritmo.
    let realizarActualizacion=()=>{
        if(!datosPosibles.includes(dato)){
            res.status(400).send();
        }
        usuarioDao.findById(editadoID)
            .then(usuario=>{
                // TODO Refactor: Enum para los permisos
                usuario[req.body.dato]=req.body.valor;
                usuario.save()
                    .then(r=>{
                        res.send();
                    })
            })
    }

    // TODO Refactor: quizá hacer algo con las rutas que se puedan si se tienen permisos
    if(req.session.usuarioID==editadoID){
        realizarActualizacion();
    }else usuarioDao.findById(req.session.usuarioID)
		.then(usuario=>{
            // TODO Refactor: Enum para los permisos
            if(!usuario.permisos.some((per)=>per.ID==2)){
                res.status(403).send();
            }else{
                // TODO Refactor: (duplicado) pasar habilitado para acá, de su propia función
                datosPosibles=datosPosibles.concat('DNI','nombreUsuario','habilitado');
                realizarActualizacion();
            }
        });
}

module.exports = usuarioController;