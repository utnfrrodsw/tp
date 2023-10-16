const db  = require('../../models');
const fs = require('fs');
const path = require('path');
const { jsonResponse } = require("../../lib/jsonResponse");

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
            const { titulo, descripcion , especialidad, idDireccion} = req.body;
            console.log(req.body);
            console.log(req.files);
            const fotosArray = req.files
            await db.sequelize.transaction( async (t) => {
                // Paso 1: Crea una solicitud
                const solicitud = await db.Solicitud.create(
                    {titulo: titulo,
                    especialidad: especialidad,
                    descripcion: descripcion,
                    idDireccion: idDireccion,
                    estado: 'activa',
                    fechaHora: Date.now()},
                    {transaction: t}
                );

              
                // Paso 2: Crea múltiples registros de FotoSolicitud relacionados con la solicitud
                const fotosPromises = fotosArray.map(async (fotoData) => {
                    return db.FotoSolicitud.create({ 
                        foto: fs.readFileSync(path.join(__dirname + '../../../images/' + fotoData.filename)),
                        nombre: fotoData.originalname,
                        tipo: fotoData.mimetype,
                        idSolicitud: solicitud._previousDataValues.idSolicitud },
                        { transaction: t });
                });
                await Promise.all(fotosPromises);
            });


        }catch(error){
            console.error('Error al crear solicitud', error);
            res.status(500).json(jsonResponse(500,{ message: 'Error en el servidor al subir solicitud' }));
        }
    }
};

module.exports = solicitudController;