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
                }]
            })
            .then((presupuestos) => {
                console.log(presupuestos);
                const presupuestosInfo = [];
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
    }
};

module.exports = presupuestosController;