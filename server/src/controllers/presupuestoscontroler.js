const { jsonResponse } = require('../lib/jsonResponse');
const db = require('../models');
const {getPresupuestoInfo} = require('../lib/getPresupuestoInfo');

const presupuestosController = {
    getPresupuestosSolicitud: async (req, res) => {
        const idSolictud = req.params.idSolictud;
        try{
            await db.Presupuesto.findAll({
                where: {
                    idSolicitud: idSolictud
                },
                include:[{
                    association: 'usuario',
                },
                {
                    association: 'horariosPresupuesto',
                }
                ]
            })
            .then((presupuestos) => {
                const presupuestosInfo = [];
                console.log(presupuestos);
                presupuestos.map((presupuesto) => {
                    presupuestosInfo.push(getPresupuestoInfo(presupuesto));
                });

                res.status(200).json(jsonResponse(200, {
                    presupuestos: presupuestosInfo
                }));
            });
        }catch(error){
            console.log(error);
            res.status(500).json(jsonResponse(500,{
                message: 'Error al obtener los presupuestos'
            }))
        }
    },

    pagarPresupuesto: async (req, res) => {
        const idSolicitud = req.params.idSolicitud;
        const idPrestador = req.params.idPrestador;
        const fechaHora = req.body.fecha;
        try{
            await db.sequelize.transaction( async (t) => {
                await db.Solicitud.update({
                    estado: 'progreso'
                },{
                    where: {
                        idSolicitud: idSolicitud,
                    }
                }, {transaction: t})
                console.log('paso 1');
                await db.Servicio.create({
                    idSolicitud: idSolicitud,
                    idUsuario: idPrestador,
                    fechaHora: fechaHora,
                    estado: 'progreso'
                }, {transaction: t})
                console.log('paso 2');
                res.status(200).json(jsonResponse(200, {
                    message: 'Pago realizado con éxito'
                }));
            })
        }catch(error){
            console.log(error);
            res.status(500).json(jsonResponse(500,{
                message: 'Error al obtener los presupuestos'
            }))
        }
    },

};

module.exports = presupuestosController;