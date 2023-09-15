import { localidadRepository } from "./localidad.repository.js";
import { Localidad } from "./localidad.entity.js";
const repository = new localidadRepository();
//satinizacion de datos
function sanitizeLocalidadInput(req, res, next) {
    req.body.sanitizedInput = {
        NombreLocalidad: req.body.NombreLocalidad
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] == undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
//GET
function findAll(req, res) {
    res.json({ data: repository.findAll() });
}
;
//Get X id
function findOne(req, res) {
    const localidadEncontrada = repository.findOne({ id: req.params.id });
    if (!localidadEncontrada) {
        res.status(404).send({ message: 'Localidad no encontrada' });
    }
    res.json({ data: localidadEncontrada });
}
;
//Post
function add(req, res) {
    const input = req.body.sanitizedInput;
    const localidadNueva = new Localidad(input.NombreLocalidad);
    const localidad = repository.add(localidadNueva);
    res.status(201).send({ message: 'Localidad creada', data: localidad });
}
;
//Put actualizar una categoria completa
function update(req, res) {
    req.body.sanitizedInput.IdLocalidad = req.params.id;
    const localidad = repository.update(req.body.sanitizedInput);
    if (!localidad) {
        return res.status(404).send({ message: 'Localidad no encontrada' });
    }
    return res.status(200).send({ message: 'Localidad actualizada', data: localidad });
}
;
//Delete eliminar una localidad
function remove(req, res) {
    const localidadID = repository.delete({ id: req.params.id });
    if (!localidadID) {
        res.status(404).send({ message: 'Localidad no encontrada' });
    }
    else {
        res.status(200).send({ message: 'Localidad eliminada', data: localidadID });
    }
}
;
export { sanitizeLocalidadInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=localidad.controler.js.map