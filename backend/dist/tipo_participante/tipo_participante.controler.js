import { tipo_participanteRepository } from './tipo_participante.repository.js';
import { Tipo_participante } from './tipo_participante.entity.js';
const repository = new tipo_participanteRepository();
function sanitizeTipo_participanteInput(req, res, next) {
    req.body.sanitizedInput = {
        posicion: req.body.posicion,
        tipo_participanteClass: req.body.tipo_participanteClass,
        id: req.body.id
    };
    //Acá irían las validaciones de datos...
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
async function findAll(req, res) {
    res.json({ data: await repository.findAll() });
}
async function findOne(req, res) {
    const id = req.params.id;
    const tipo_participante = await repository.findOne({ id });
    if (!tipo_participante) {
        return res.status(404).send({ message: 'Character not found' });
    }
    return res.json({ data: tipo_participante });
}
async function add(req, res) {
    const input = req.body.sanitizedInput;
    const tipo_participanteInput = new Tipo_participante(input.posicion, input.id);
    const tipo_participante = await repository.add(tipo_participanteInput);
    return res.status(201).send({ message: 'tipo_participante ha sido creado correctamente', data: tipo_participante });
}
async function update(req, res) {
    req.body.sanitizedInput.id = req.params.id;
    const tipo_participante = await repository.update(req.params.id, req.body.sanitizedInput);
    if (!tipo_participante) {
        return res.status(404).send({ message: 'tipo_participante not found' });
    }
    return res.status(200).send({ message: 'tipo_participante updated successfully', data: tipo_participante });
}
async function remove(req, res) {
    const id = req.params.id;
    const tipo_participante = await repository.delete({ id });
    if (!tipo_participante) {
        res.status(404).send({ message: 'tipo_participante not found' });
    }
    else {
        res.status(200).send({ message: 'tipo_participante deleted successfully' });
    }
}
export { sanitizeTipo_participanteInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=tipo_participante.controler.js.map