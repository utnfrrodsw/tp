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
    },

    createSolicitud: async function (req, res){
        try{
            console.log(req.body);
            console.log(req.files);
            /*const {titulo, descripcion, especialidad, ubicacion} = req.body;
            fotos = [];
            for (let i = 0; i < req.files.length; i++) {
                fotos.push(req.files[i].filename);
            }
            console.log(fotos);
            const solicitud = await db.Solicitud.create({
                titulo: titulo,
                descripcion: descripcion,
                especialidad: especialidad,
                fotos: fotos,
                estado: 'activa',
                idDireccion: ubicacion // aca hay que tomar las direcciones del cliente y elegir una
            })
            .then(function(solicitud){
                if(solicitud) {
                    res.status(200).json(jsonResponse(200,{
                        message: 'Solicitud creada',
                        solicitud: solicitud
                    }));
                }else{
                    res.status(500).json(jsonResponse(500, { message: 'Error al crear solicitud' }));
                }
            })
            .catch(function(error){
                console.error('Error al crear solicitud', error);
                res.status(500).json(jsonResponse(500, { message: 'Error en el servidor' }));
            })*/

            //falta subir fotos

        }catch(error){
            console.error('Error al crear solicitud', error);
            res.status(500).json(jsonResponse(500,{ message: 'Error en el servidor' }));
        }
    }
};

module.exports = solicitudController;