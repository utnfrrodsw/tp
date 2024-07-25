import { LocalidadesRepository } from "./localidades.repository.js";
import { Localidad } from "./localidades.entity.js";
const repository = new LocalidadesRepository();
function sanitizarLocalidadInput(req, res, next) {
    req.body.sanitizarLoc = {
        nombre_localidad: req.body.nombre_localidad,
    };
    //Acá irían las validaciones de datos...
    Object.keys(req.body.sanitizarLoc).forEach(key => {
        if (req.body.sanitizarLoc[key] === undefined) {
            delete req.body.sanitizarLoc[key];
        }
    });
    next();
}
async function findAll(req, res) {
    res.json({ data: await repository.findAll() });
}
async function findOne(req, res) {
    const id = req.params.id;
    const localidad = await repository.findOne({ id });
    if (!localidad) {
        res.status(404).send({ message: 'ID incorrecto, no existe ninguna localidad con el ID indicado' });
    }
    else {
        res.json({ data: localidad });
    }
}
async function add(req, res) {
    const input = req.body.sanitizarLoc;
    const localidadInput = new Localidad(input.nombre_localidad);
    const localidad = await repository.add(localidadInput);
    res.status(201).send({ message: 'Localidad caragada correctamente', data: localidad });
}
async function update(req, res) {
    req.body.sanitizarLoc.id = req.params.id;
    const localidad = await repository.update(req.body.sanitizarLoc);
    if (!localidad) {
        res.status(404).send({ message: 'ID incorrecto, no existe ninguna localidad con el ID indicado' });
    }
    else {
        res.status(200).send({ message: 'Localidad modificada correctamente', data: localidad });
    }
}
async function remove(req, res) {
    const id = req.params.id;
    const localidad = await repository.delete({ id });
    if (!localidad) {
        res.status(404).send({ message: 'ID incorrecto, no existe ninguna localidad con el ID indicado' });
    }
    else {
        res.status(200).send({ message: 'Localidad borrada correctamente' });
    }
}
export { sanitizarLocalidadInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=localidades.controler.js.map