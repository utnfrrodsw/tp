// const {Permiso} = require('../modelos/permiso');
const {Token} = require('../modelos/usuario');

var tokensDao = {
    obtenerCantidadCirculando
}

function obtenerCantidadCirculando() {
    return Token.findAndCountAll();
}

module.exports = tokensDao;