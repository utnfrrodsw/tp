// const {Permiso} = require('../modelos/permiso');
const {Token} = require('../modelos/usuario');

var tokensDao = {
    obtenerCantidadCirculando
    ,generar
}

function obtenerCantidadCirculando() {
    return Token.findAndCountAll();
}

function generar(cantidad,usuario){
    console.log(cantidad);
    Token.bulkCreate(new Array(cantidad).fill(new Token()))
        .then(nuevasTokens=>{
            usuario.addTokensAsociadas(nuevasTokens);
        });
    return usuario.save();
}

module.exports = tokensDao;