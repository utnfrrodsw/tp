const path = require("path");
const fs = require("fs")

const  Solicitud  = require('../../models/Solicitud.js');

const solicitudController = {
    getSolicitud: async (req, res) => {
        let idSolicitud = req.params.id;
        console.log(idSolicitud);
        try{
            const solicitud = await Solicitud.findByPk(idSolicitud,{
                include: [{association: 'cliente'}, {association: 'direccion'}]
            }
            )
            if(!solicitud) {
                return res.status(404).json({ message: 'Solicitud no encontrada' });
            }
            console.log(solicitud);
            res.json(solicitud);
            
        }catch(error){
            console.error('Error al obtener solicitud', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }

};

module.exports = solicitudController;