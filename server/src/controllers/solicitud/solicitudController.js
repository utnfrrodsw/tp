const path = require("path");
const fs = require("fs")

const  db  = require('../../models');

const solicitudController = {
    getSolicitud: function (req, res){
        let idSolicitud = req.params.id;
        console.log(idSolicitud);
        try{
            db.Solicitud.findByPk(idSolicitud,{
                include: [{association: 'direccion'}]
            })
            .then(function(solicitud){
                if(!solicitud) {
                    res.status(404).json({ message: 'Solicitud no encontrada' });
                }
                console.log(solicitud);
                res.json(solicitud);
            })
        }catch(error){
            console.error('Error al obtener solicitud', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    getSolicitudesActivasCliente: function (req, res){
        let idCliente = req.params.id;
        console.log(idCliente);
        try{
            db.Solicitud.findAll({
                where: {idCliente: idCliente},
                include: [{association: 'direccion'}]
            })
            .then(function(solicitudes){
                if(!solicitudes) {
                    res.status(404).json({ message: 'Solicitudes no encontradas' });
                }
                console.log(solicitudes);
                res.json(solicitudes);
            })
        }catch(error){
            console.error('Error al obtener solicitudes', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }
};

module.exports = solicitudController;