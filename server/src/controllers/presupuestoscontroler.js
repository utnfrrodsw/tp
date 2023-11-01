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

    createPresupuesto: async function (req, res) {
    try {
        const { idSolicitud, idUsuario, materiales, costoMateriales, tiempo, costoxHora, fechasSeleccionadas } = req.body;
        console.log(req.body);

        await db.sequelize.transaction(async (t) => {
            // Paso 1: Verificar que la solicitud con el idSolicitud existe
            const solicitud = await db.Solicitud.findByPk(idSolicitud, { transaction: t });
            if (!solicitud) {
                return res.status(400).json(jsonResponse(400, { message: 'Solicitud no encontrada' }));
            }

            // Paso 2: Crear el registro del presupuesto
            const presupuesto = await db.presupuesto.create(
                {
                    idSolicitud: idSolicitud,
                    idUsuario: idUsuario,
                    materiales: materiales,
                    costoMateriales: costoMateriales,
                    tiempoAprox: tiempo,
                    costoXHora: costoxHora
                },
                { transaction: t }
            );

            // Paso 3: Asociar las fechas seleccionadas al presupuesto (si es necesario)
            if (fechasSeleccionadas.length > 0) {
                const fechasPromises = fechasSeleccionadas.map(async (fecha) => {
                    return db.HorariosPrespuesto.create(
                        { horario: fecha, idSolicitud: presupuesto.idPresupuesto,idUsuario:presupuesto.idUsuario},
                        { transaction: t }
                    );
                });
                await Promise.all(fechasPromises);
            }
        });

        res.status(200).json(jsonResponse(200, { message: 'Presupuesto creado' }));
    } catch (error) {
        console.error('Error al crear presupuesto', error);
        console.log(req.body);
        res.status(500).json(jsonResponse(500, { message: 'Error en el servidor al crear presupuesto' }));
    }
},

};

module.exports = presupuestosController;