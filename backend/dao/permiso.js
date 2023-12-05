const {Permiso} = require('../modelos/permiso');
var permisoDao = {
    findAll: findAll
    ,findById
}

function findAll() {
    return Permiso.findAll();
}

function findById(ID) {
    return Permiso.findByPk(ID);
}

module.exports = permisoDao;