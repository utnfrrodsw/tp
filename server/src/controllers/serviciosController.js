const db = require('../models');
const { jsonResponse } = require('../lib/jsonResponse');

const serviciosController = {
    isReviewed: async (req, res) => {
        const idSolicitud = req.params.idSolicitud;
        const idUsuario = req.params.idUsuario;
        
        try{
            const servicio = await db.Servicio.findOne({
                where: {
                    idSolicitud: idSolicitud,
                    idUsuario: idUsuario,
                }
            })
            
            if(servicio.resenia === 6){
                res.status(200).json(jsonResponse(200, {isReviewed: false}))
            }else{
                res.status(200).json(jsonResponse(200, {isReviewed: true}))
            }
        }catch(error){
            
            res.status(500).json(jsonResponse(500, {message: 'Error interno del servidor'}))
        }
        
    },

    setReview: async (req, res) => {
        const { idSolicitud, idUsuario } = req.params;
        const { resenia } = req.body;
        
        try{
            db.sequelize.transaction(async (t) => {
                const servicio = await db.Servicio.findOne({
                    where: {
                        idSolicitud: idSolicitud,
                        idUsuario: idUsuario,
                    }
                }, {transaction: t})
                if(servicio.resenia === 6){
                    await db.Servicio.update({resenia}, {
                        where: {
                            idSolicitud: idSolicitud,
                            idUsuario: idUsuario,
                        }
                    }, {transaction: t})
                    res.status(200).json(jsonResponse(200, {message: 'Reseña cargada con éxito'}))
                }else{
                    res.status(400).json(jsonResponse(400, {message: 'Ya se cargó una reseña para este servicio'}))
                }
            });
        }catch(error){
            
            res.status(500).json(jsonResponse(500, {message: 'Error interno del servidor'}))
        }

    },

    setAConfirmar: async (req, res) => {
        
        const { idSolicitud, id } = req.params;
        try {
            await db.sequelize.transaction(async (t) => {
                await db.Servicio.update(
                    { estado: "aConfirmar" },
                    {
                        where: {
                            idSolicitud: idSolicitud,
                            idUsuario: id,
                        }, // La opción de transacción debe ir aquí
                }, {transaction: t});
            });
            res.status(200).json(jsonResponse(200, { message: 'Estado del servicio actualizado con éxito' }));
        } catch (error) {
         res.status(500).json(jsonResponse(500, { message: 'Error interno en el servidor' }));
        }
    }
};

module.exports =  serviciosController;