import { PartidosRepository } from "./partido.repository.js";
import { Partido } from "./partido.entity.js";
const repository = new PartidosRepository();
function sanitizarPartidoInput(req, res, next) {
    req.body.sanitizarEq = {
        fecha: req.body.fecha,
        torneo: req.body.torneo,
        equipo1: req.body.equipo1,
        equipo2: req.body.equipo2,
        id: req.body.id
    };
    //Acá irían las validaciones de datos...
    Object.keys(req.body.sanitizarEq).forEach(key => {
        if (req.body.sanitizarEq[key] === undefined) {
            delete req.body.sanitizarEq[key];
        }
    });
    next();
}
async function findAll(req, res) {
    return res.json({ data: await repository.findAll() });
}
async function findOne(req, res) {
    const id = req.params.id;
    const partido = await repository.findOne({ id });
    if (!partido) {
        return res.status(404).send({ message: 'ID incorrecto, no existe ninguna partido con el ID indicado' });
    }
    else {
        return res.json({ data: partido });
    }
}
async function add(req, res) {
    const input = req.body.sanitizarEq;
    const partidoInput = new Partido(input.fecha, input.torneo, input.equipo1, input.equipo2, input.id);
    const partido = await repository.add(partidoInput);
    return res.status(201).send({ message: 'Partido caragado correctamente', data: partido });
}
async function update(req, res) {
    req.body.sanitizarEq.id = req.params.id;
    const partido = await repository.update(req.params.id, req.body.sanitizarEq);
    if (!partido) {
        return res.status(404).send({ message: 'ID incorrecto, no existe ningún partido con el ID indicado' });
    }
    else {
        return res.status(200).send({ message: 'Partido modificado correctamente', data: partido });
    }
}
async function remove(req, res) {
    const id = req.params.id;
    const partido = await repository.delete({ id });
    if (!partido) {
        return res.status(404).send({ message: 'ID incorrecto, no existe ningún partido con el ID indicado' });
    }
    else {
        return res.status(200).send({ message: 'Partido borrado correctamente' });
    }
}
export { sanitizarPartidoInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=partido.controler.js.map