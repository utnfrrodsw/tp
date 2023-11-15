const path = require("path");
const { check } = require("express-validator");
const {validateResult} = require('../validateHelper.js');

const validateSolicitudCreate = [
    check("titulo")
    .notEmpty()
    .withMessage("El titulo es requerido")
    .isLength({ min: 4 , max: 45})   
    .withMessage("El titulo debe tener al menos 4 caracteres y 45 como maximo"),
    check("descripcion")
    .notEmpty()
    .withMessage("Debe explicar brevemente su solicitud")
    .isLength({ min: 20 , max: 255})
    .withMessage("La descripcion debe tener al menos 20 caracteres y 255 como maximo"),
    check("idProfesion")
    .notEmpty()
    .withMessage("Debe seleccionar una profesion"),
    check("idDireccion")
    .notEmpty()
    .withMessage("Debe seleccionar una direccion, puede agregarlo en sus datos personales"),
    check("fotos").custom((value, { req }) => {
        let files = req.files;
        let acceptedExtensions = [".jpg", ".png", ".jpeg"];
        console.log(files);
        if (files.length == 0 ) {
          throw new Error("Tiene que subir al menos una imagen");
        } else if (files.length <= 5) {
            files.map((file) => {
                let fileExtension = path.extname(file.originalname);
                if (!acceptedExtensions.includes(fileExtension)) {
                  throw new Error(
                    `Las extensiones de archivo permitidas son ${acceptedExtensions.join(
                      ", "
                    )}`
                  );
                }
            });
        }else if(files.length > 5){
            throw new Error('Solo puede subir hasta 5 imagenes');
        }
        return true;
    }),
    (req, res, next) => {
        validateResult(req, res, next);
    },
];

module.exports = {validateSolicitudCreate};