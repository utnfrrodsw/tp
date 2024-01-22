const { jsonResponse } = require('../lib/jsonResponse');
const db = require('../models');
const {getPresupuestoInfo} = require('../lib/getPresupuestoInfo');
const {getPresuServInfo}= require('../lib/getPresuServInfo');
const serviciosController = require('./serviciosController');


const presupuestosController = {
    getPresupuestosSolicitud: async (req, res) => {
        const idSolictud = req.params.idSolictud;
        const presupuestosInfo = [];
        try{
            await db.sequelize.transaction(async (t) => {
                const presupuestos = await db.Presupuesto.findAll({
                  where: {
                    idSolicitud: idSolictud
                  },
                  include: [{
                    association: 'usuario',
                  }]
                }, { transaction: t });
            
                const promises = presupuestos.map(async (presupuesto) => {
                  const horarios = await db.HorariosPresupuesto.findAll({
                    where: {
                      idSolicitud: presupuesto.idSolicitud,
                      idUsuario: presupuesto.idUsuario
                    }
                  }, { transaction: t });
            
                  
                  const promedio = await db.Servicio.findOne({
                    attributes: [
                    [db.sequelize.fn('AVG', db.sequelize.col('resenia')), 'rating'],
                    ],
                    group: ['idUsuario'],
                    where: {
                      idUsuario: presupuesto.idUsuario
                    }
                  }, { transaction: t });
                  presupuestosInfo.push(getPresupuestoInfo(presupuesto, horarios, promedio));
                });
            
                await Promise.all(promises);
            });
            //ordenar presupuestos por costo total, menor a mayor
            presupuestosInfo.sort((a, b) => a.costoTotal - b.costoTotal);
            res.status(200).json(jsonResponse(200, {
                presupuestos: presupuestosInfo
            }));

        }catch(error){
            
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
                }, { transaction: t })
                
                await db.Servicio.create({
                    idSolicitud: idSolicitud,
                    idUsuario: idPrestador,
                    fechaHora: fechaHora,
                    estado: 'progreso'
                }, { transaction: t })
                
            })
            res.status(200).json(jsonResponse(200, {
                message: 'Pago realizado con éxito'
            }));
        }catch(error){
            
            res.status(500).json(jsonResponse(500,{
                message: 'Error al obtener los presupuestos'
            }))
        }
    },

    createPresupuesto: async function (req, res) {
    try {
        const { idSolicitud, idUsuario, materiales, costoMateriales, tiempo, costoxHora, fechasSeleccionadas } = req.body;
        

        await db.sequelize.transaction(async (t) => {
            // Paso 1: Verificar que la solicitud con el idSolicitud existe
            
            const solicitud = await db.Solicitud.findByPk(idSolicitud, { transaction: t });
            if (!solicitud) {
                return res.status(400).json(jsonResponse(400, { message: 'Solicitud no encontrada' }));
            }

            // Paso 2: Crear el registro del presupuesto
            
            await db.Presupuesto.create(
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
            // Paso 3: Asociar las fechas seleccionadas al presupuesto
            
            if (fechasSeleccionadas.length > 0) {
                const fechasPromises = fechasSeleccionadas.map(async (fecha) => {
                    return db.HorariosPresupuesto.create(
                        { idSolicitud: idSolicitud, idUsuario:idUsuario, horario: fecha},
                        { transaction: t }
                    );
                });
                await Promise.all(fechasPromises);
            }
        });

        res.status(200).json(jsonResponse(200, { message: 'Presupuesto creado' }));
    } catch (error) {
        console.error('Error al crear presupuesto', error);
        
        res.status(500).json(jsonResponse(500, { message: 'Error en el servidor al crear presupuesto' }));
    }
},
    getPresupuestoByPK : async (req, res) => {
    const idSolicitud = req.params.idSolicitud;
    const idUsuario = req.params.id;
    
    

    try {
        await db.sequelize.transaction(async (t) => {
            const direccion = await db.Direccion.findOne({
                include: [
                {
                    association:'usuario',
                    required: true
                },
                {
                    association:'localidad',
                    required: true
                },
                {
                    association: 'solicitudes',
                    required: true,
                    where: {
                    idSolicitud: idSolicitud
                    },                   
                }
            ]
            });
            
            if (!direccion) {
                return res.status(404).json(jsonResponse(404, {
                    message: 'direccion no encontrada'
                }));
            }

            const presupuesto = await db.Presupuesto.findOne({
                where: {
                    idSolicitud: idSolicitud,
                    idUsuario: idUsuario
                },
                include: [{
                    association: 'horariosPresupuesto',
                    required: true
                },
                {
                    association: 'presupuesto'
                }
                ]
            });

            if (!presupuesto) {
                return res.status(404).json(jsonResponse(404, {
                    message: 'Presupuesto no encontrado'
                }));
            }

            const presupuestoInfo = getPresuServInfo(presupuesto, direccion);

            res.status(200).json(jsonResponse(200, {
                presupuesto: presupuestoInfo
            }));
        });
    } catch (error) {
        
        res.status(500).json(jsonResponse(500, {
            message: 'Error al obtener los presupuestos'
        }));
    }
    }
};

module.exports = presupuestosController;