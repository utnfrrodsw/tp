const db  = require('../../models');
const fs = require('fs');
const path = require('path');
const { jsonResponse } = require("../../lib/jsonResponse");
const {getSolicitudInfo} = require("../../lib/getSolicitudInfo");
const PrestadorProfesiones = require('../../models/PrestadorProfesiones');
const Profesion = require('../../models/Profesion');
const Presupuesto = require('../../models/Presupuesto');
const Sequelize = require('sequelize');
const { getSolicitudInfoPres } = require('../../lib/getSolicitudInfoPres');
const { Op } = Sequelize;


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

    getSolicitudesClienteEstado: function (req, res){
        try{
            const id = req.params.id; 
            const estado = req.params.estado; 
            db.Solicitud.findAll({
            where: {
                estado: estado
            },
            include: [{
                association: 'direccion',
                where: {
                    idUsuario: id
                },
                },
                {
                    association: 'fotosSolicitud' // Si necesitas acceder a las fotos de las solicitudes
                },
                {
                    association: 'profesiones' // Si necesitas acceder a las profesiones de las solicitudes
                }
            ]
            }).then( (solicitudesResponse) => {

                const solicitudes = []

                solicitudesResponse.map((solicitud) => {
                
                    const imgs = solicitud.fotosSolicitud.map((foto) => {
                
                        // Guarda la imagen como archivo individual
                        const filePath = path.join(__dirname, '../../../public/images/imagesdb/' + foto.idfoto + '-fastServices.png');
                        fs.writeFileSync(filePath, foto.foto);
                
                        return {
                            id: foto.idfoto,
                            foto: (foto.idfoto + '-fastServices.png'),// Proporciona la ruta al archivo
                        };
                    });
                    solicitudes.push(getSolicitudInfo(solicitud, imgs));
                });
                
                
                res.status(200).json(jsonResponse(200, {
                    message: "Solicitudes encontradas",
                    //images: images,
                    solicitudes: solicitudes
                }))
            })
            .catch((error) => {
            // Maneja cualquier error
                res.status(500).json(jsonResponse(500, {
                    message: "Error al buscar las solicitudes",
                    solicitudes: [],
                }));
                
            });
        }catch(error){
            console.error('Error al obtener solicitudes', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    createSolicitud: async function (req, res){
        try{
            const { titulo, descripcion, idProfesion, idDireccion} = req.body;
            console.log(req.body);
            console.log(req.files);
            const fotosArray = req.files
            await db.sequelize.transaction( async (t) => {
                // Paso 1: Crea una solicitud
                const solicitud = await db.Solicitud.create(
                    {titulo: titulo,
                    descripcion: descripcion,
                    idDireccion: idDireccion,
                    idProfesion: idProfesion,
                    estado: 'activa',
                    fechaHora: Date.now()},
                    {transaction: t}
                );
              
                // Paso 2: Crea múltiples registros de FotoSolicitud relacionados con la solicitud
                const fotosPromises = fotosArray.map(async (fotoData) => {
                    return db.FotoSolicitud.create({ 
                        foto: fs.readFileSync(path.join(__dirname + '../../../../public/images/solicitud/' + fotoData.filename)),
                        nombre: fotoData.originalname,
                        tipo: fotoData.mimetype,
                        idSolicitud: solicitud._previousDataValues.idSolicitud },
                        { transaction: t });
                });
                await Promise.all(fotosPromises);
            });
            res.status(200).json(jsonResponse(200,{ message: 'Solicitud creada' }));
        }catch(error){
            console.error('Error al crear solicitud', error);
            res.status(500).json(jsonResponse(500,{ message: 'Error en el servidor al subir solicitud' }));
        }
    },
    
    CancelarSolicitud: async function (req, res){
        try {
            const idSolicitud = req.params.id;
            console.log(idSolicitud);
            await db.sequelize.transaction(async (t) => {
              // Paso 1: Buscar la solicitud
              await db.FotoSolicitud.destroy({ where: { idSolicitud: idSolicitud } }, { transaction: t });

              const solicitud = await db.Solicitud.findByPk(idSolicitud);
              if (!solicitud) {
                res.status(404).json(jsonResponse(404, { message: 'Solicitud no encontrada' }));
                return; // Debes regresar para evitar ejecutar el código restante en caso de que no se encuentre la solicitud.
              }
          
              // Paso 2: Eliminar la solicitud
              await db.Solicitud.destroy({ where: { idSolicitud: idSolicitud } }, { transaction: t });
            });
          
            res.status(200).json(jsonResponse(200, { message: 'Solicitud cancelada' }));
        } catch (error) {
        console.error('Error al cancelar solicitud', error);
        res.status(500).json(jsonResponse(500, { message: 'Error en el servidor al cancelar solicitud' }));
        }
          
    },

    getSolicitudesProfesion: async function (req, res){
        try {
        const idPrestador = req.params.id; 

        // profesiones asociadas al prestador
        const prestadorProfesiones = await db.PrestadorProfesiones.findAll({
        attributes: ['idPrestador', 'idProfesion'],
            where: {
                idPrestador: idPrestador,
            },
        }); 
        const profesionIds = prestadorProfesiones.map(profesion => profesion.idProfesion); //Agarro solo ids

        //Solicitudes ya presupuestadas
        const solicitudesPresupuestadas=await db.Presupuesto.findAll({
        attributes: ['idSolicitud','idUsuario'],
            where: {
                idUsuario: idPrestador,
            },
        });
        const presupuestoIds = solicitudesPresupuestadas.map(presu => presu.idSolicitud); //Agarro solo ids

        //Misma localidad para el prestador y la solicitud
        const prestadorCiudad = await db.Direccion.findAll({
        attributes: ['idUsuario', 'codPostal'],
            where: {
                idUsuario: idPrestador,
            },
        });
        const codPostalPres = prestadorCiudad.map(dir => dir.codPostal);


        console.log(presupuestoIds);
        console.log(profesionIds);
        console.log(codPostalPres);
        // Ahora, busca las solicitudes que tienen profesiones en la lista de IDs
        await db.Solicitud.findAll({
            where: {
                estado: 'activa',
                idProfesion:profesionIds,
                idSolicitud: {
                                [Op.notIn]: presupuestoIds
                        }
            },
            include: [
                {
                    association: 'direccion',
                    where:{
                        codPostal:codPostalPres,
                    }
                },
                {
                    association: 'fotosSolicitud' 
                },
            ]
            }).then( (solicitudesResponse) => {
                console.log(solicitudesResponse);
                const solicitudes = []

                solicitudesResponse.map((solicitud) => {
                
                    const imgs = solicitud.fotosSolicitud.map((foto) => {
                
                        // Guarda la imagen como archivo individual
                        const filePath = path.join(__dirname, '../../../public/images/imagesdb/' + foto.idfoto + '-fastServices.png');
                        fs.writeFileSync(filePath, foto.foto);
                
                        return {
                            id: foto.idfoto,
                            foto: (foto.idfoto + '-fastServices.png'),// Proporciona la ruta al archivo
                        };
                    });
                    solicitudes.push(getSolicitudInfoPres(solicitud, imgs));
                });
                
                
                res.status(200).json(jsonResponse(200, {
                    message: "Solicitudes encontradas",
                    //images: images,
                    solicitudes: solicitudes
                }))
            })
            .catch((error) => {
            // Maneja cualquier error
                res.status(500).json(jsonResponse(500, {
                    message: "Error al buscar las solicitudes",
                    solicitudes: [],
                }));
                
            });
        }catch(error){
            console.error('Error al obtener solicitudes', error);
            res.status(500).json({ message: 'Error en el servidor' });
        };
    },

    getSolicitudesPresupuestadas: async function (req, res){
        try {
        const idPrestador = req.params.id; 

        //Busco el id de las solicitudes que presupueste
        const solicitudesPresupuestadas=await db.Presupuesto.findAll({
        attributes: ['idSolicitud','idUsuario'],
            where: {
                idUsuario: idPrestador,
            },
        });
        const presupuestoIds = solicitudesPresupuestadas.map(presu => presu.idSolicitud);
        
        //Busco el id de los presupuestos que me aceptaron
        const servicios=await db.Servicio.findAll({
        attributes: ['idSolicitud','idPrestador'],
            where: {
                idPrestador: idPrestador,
            },
        });
        const serviciosIds = servicios.map(ser => ser.idSolicitud);

        // Ahora, busca las solicitudes presupuestadas por mi que no me aceptaron
        await db.Solicitud.findAll({
        attributes: ['idSolicitud','fechaHora','titulo','descripcion','estado','idDireccion','idProfesion'],
            where: {
                idSolicitud: {
                                [Op.in]: presupuestoIds,
                                [Op.notIn]: serviciosIds
                        }
            },
            include: [
                {
                    association: 'direccion'
                },
                {
                    association: 'fotosSolicitud' 
                },
            ]
            }).then( (solicitudesResponse) => {
                const solicitudes = []

                solicitudesResponse.map((solicitud) => {
                
                    const imgs = solicitud.fotosSolicitud.map((foto) => {
                
                        // Guarda la imagen como archivo individual
                        const filePath = path.join(__dirname, '../../../public/images/imagesdb/' + foto.idfoto + '-fastServices.png');
                        fs.writeFileSync(filePath, foto.foto);
                
                        return {
                            id: foto.idfoto,
                            foto: (foto.idfoto + '-fastServices.png'),// Proporciona la ruta al archivo
                        };
                    });
                    solicitudes.push(getSolicitudInfoPres(solicitud, imgs));
                });
                
                
                res.status(200).json(jsonResponse(200, {
                    message: "Solicitudes encontradas",
                    //images: images,
                    solicitudes: solicitudes
                }))
            })
            .catch((error) => {
            // Maneja cualquier error
                res.status(500).json(jsonResponse(500, {
                    message: "Error al buscar las solicitudes",
                    solicitudes: [],
                }));
                
            });
        }catch(error){
            console.error('Error al obtener solicitudes', error);
            res.status(500).json({ message: 'Error en el servidor' });
        };
    },

    getSolicitudesAceptadas: async function (req, res){
        try {
        const idPrestador = req.params.id; 

        //Busco el id de los presupuestos que me aceptaron
        const servicios=await db.Servicio.findAll({
        attributes: ['idSolicitud','idPrestador'],
            where: {
                idPrestador: idPrestador,
            },
        });
        const serviciosIds = servicios.map(ser => ser.idSolicitud);

        // Ahora, busca las solicitudes que me aceptaron
        await db.Solicitud.findAll({
        attributes: ['idSolicitud','fechaHora','titulo','descripcion','estado','idDireccion','idProfesion'],
            where: {
                idSolicitud: {
                                [Op.in]: serviciosIds
                        }
            },
            include: [
                {
                    association: 'direccion'
                },
                {
                    association: 'fotosSolicitud' 
                },
            ]
            }).then( (solicitudesResponse) => {
                const solicitudes = []

                solicitudesResponse.map((solicitud) => {
                
                    const imgs = solicitud.fotosSolicitud.map((foto) => {
                
                        // Guarda la imagen como archivo individual
                        const filePath = path.join(__dirname, '../../../public/images/imagesdb/' + foto.idfoto + '-fastServices.png');
                        fs.writeFileSync(filePath, foto.foto);
                
                        return {
                            id: foto.idfoto,
                            foto: (foto.idfoto + '-fastServices.png'),// Proporciona la ruta al archivo
                        };
                    });
                    solicitudes.push(getSolicitudInfoPres(solicitud, imgs));
                });
                
                
                res.status(200).json(jsonResponse(200, {
                    message: "Solicitudes encontradas",
                    //images: images,
                    solicitudes: solicitudes
                }))
            })
            .catch((error) => {
            // Maneja cualquier error
                res.status(500).json(jsonResponse(500, {
                    message: "Error al buscar las solicitudes",
                    solicitudes: [],
                }));
                
            });
        }catch(error){
            console.error('Error al obtener solicitudes', error);
            res.status(500).json({ message: 'Error en el servidor' });
        };
    },
    
}

module.exports = solicitudController;