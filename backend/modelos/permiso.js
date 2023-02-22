
const Sequelize = require('sequelize');
const db = require('../datos/db');
const {Usuario}=require('./usuario');

const Permiso = db.define('permiso', {
    ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const UsuarioPermiso = db.define('usuario_permiso');

const opcionesUsuarioPermiso={
    through: UsuarioPermiso
    ,constraints:false
};

Permiso.sync()
    .then(()=>{
        Permiso.findAll()
            .then(permisos=>{
                if(! permisos.length){
                    Permiso.bulkCreate([
                        {
                            descripcion:'Enviar Tokens'
                        }
                        ,{
                            descripcion:'Crear Usuarios'
                        }
                    ])
                }
            });

        Usuario.belongsToMany(Permiso, opcionesUsuarioPermiso);
        Permiso.belongsToMany(Usuario, opcionesUsuarioPermiso);
    
        UsuarioPermiso.sync();
    });

module.exports = {Permiso};