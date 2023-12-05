
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
    },
    amigos: {
        type: Sequelize.VIRTUAL
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

// Relaciones:
// Persona A / 
// Persona B
// Estado: Esperando, amigos, bloqueado

const ESTADOS_AMISTADES={
    ESPERANDO:'esperando',
    AMIGOS:'amigos'
};

const Amistades=db.define('amistades',{
    estado: {
        type: Sequelize.ENUM(...Object.values(ESTADOS_AMISTADES)),
        defaultValue:ESTADOS_AMISTADES.ESPERANDO,
        allowNull: false
    }
});

Usuario.belongsToMany(Usuario,{
    as:'amigosAceptados'
    ,through:Amistades
    ,foreignKey:'amigoID'
    ,...opcionesComunes
});

Usuario.belongsToMany(Usuario,{
    as:'amigosInvitados'
    ,through:Amistades
    ,foreignKey:'usuarioID'
    ,...opcionesComunes
});

Amistades.sync();

Usuario.sync();
Token.sync();

module.exports = {Usuario,Token,Amistades,ESTADOS_AMISTADES};