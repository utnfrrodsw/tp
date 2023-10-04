const path = require("path");
const fs = require("fs")

const solicitudController = {
    getSolicitud: async (req, res) => {
        try{
            const solicitud = await Solicitud.findAll();
            res.json(solicitud);
        }catch{
            console.error('Error al obtener solicitud', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }



};