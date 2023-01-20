
const Sequelize = require('sequelize');
const db = require('../datos/db');

const Token = db.define('token', {
    ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});
const Usuario = db.define('usuario', {
    ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombreCompleto: {
        type: Sequelize.STRING,
        allowNull: false
    },
    DNI: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    nombreUsuario: {
        type: Sequelize.STRING,
        allowNull: false
    },
    contrasenia: {
        type: Sequelize.STRING,
        allowNull: false
    },
    correo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    habilitado: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
});

const opcionesComunes={
    constraints:false
}

Token.belongsTo(Usuario,{
    as:'duenio'
    ,...opcionesComunes
})
Usuario.hasMany(Token,{
    as:'tokensAsociadas'
    ,foreignKey: 'duenioID'
    ,...opcionesComunes
});

Usuario.sync();
Token.sync();

module.exports = {Usuario,Token};