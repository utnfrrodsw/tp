const path = require("path");
const { check } = require("express-validator");
const {validateResult} = require('../validateHelper.js');

const validatePresupuesto = [
    check("idSolicitud")
    .notEmpty()
    .withMessage("Error al obtener el id de la solicitud"),
    check("idUsuario")
    .notEmpty()
    .withMessage("Error al obtener el id del prestador"),
    check("materiales")
    .notEmpty()
    .withMessage("Debe agregar los materiales que utilizara")
    .isLength({ min: 5 })
    .withMessage("Debe agregar al menos un material"),
    check("tiempo")
    .notEmpty()
    .withMessage("Debe agregar el tiempo estimado en horas")
    .isNumeric()
    .withMessage("El tiempo debe ser un numero entero"),
    check("costoxHora")
    .notEmpty()
    .withMessage("Debe agregar el costo por hora")
    .isDecimal()
    .withMessage("El costo por hora puede ser un numero decimal"),
    check("fechasSeleccionadas").custom((value, { req }) => {
        let fechas = req.body.fechasSeleccionadas;
        if(fechas.length == 0){
            throw new Error("Debe seleccionar al menos una fecha");
        }
        fechas.map((fecha) => {
            if(fecha < new Date().toISOString().slice(0, 16)){
                throw new Error("No puede seleccionar una fecha anterior a la actual, ni tampoco la actual");
            }
            const hoy = new Date();
            const fechaLimite = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 30);
            if(fecha > fechaLimite.toISOString().slice(0, 16)){
                throw new Error("No puede seleccionar una fecha posterior a 30 dias");
            }

            const fechaHora = new Date(fecha);
            const hora = fechaHora.getHours();
            console.log(hora);

            if(hora > 18 || hora < 8){
                throw new Error("Debe seleccionar una hora entre las 08:00 hs y las 19:00 hs");
            }
        });
        return true;
    }),
    (req, res, next) => {
        validateResult(req, res, next);
    },
];

module.exports = {validatePresupuesto};