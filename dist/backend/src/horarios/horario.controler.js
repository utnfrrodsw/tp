import { DeporteRepository } from '../deporte/deporte.repository.ts';
import { Horario } from './horario.entity.js';
import { HorarioRepository } from './horarios.repository.js';
const repository = new HorarioRepository();
const repository2 = new DeporteRepository();
function sanitizeHorarioInput(req, res, next) {
    req.body.sanitizedInput = {
        dia: req.body.dia,
        hora_inicio: req.body.hora_inicio,
    };
    //more checks here
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
function findAll(req, res) {
    res.json({ data: repository.findAll() });
}
function findOne(req, res) {
    const id = req.params.id;
    const deporte = repository2.findOne({ id });
    if (!deporte) {
        return res.status(404).send({ message: 'No se encontró el deporte' });
    }
    res.json({ data: deporte.horario });
}
function add(req, res) {
    const input = req.body.sanitizedInput;
    const horarioInput = new Horario(input.dia, input.hora_inicio);
    const idDeporte = req.params.id;
    const deporte = repository2.findOne({ id: idDeporte });
    if (!deporte) {
        return res.status(404).send({ message: 'No se encontró el deporte' });
    }
    const horarioAgregado = repository.add(horarioInput, { id: idDeporte });
    if (!horarioAgregado) {
        return res.status(500).send({ message: 'Error al añadir el horario' });
    }
    return res.status(201).send({ message: 'Nuevo Horario Añadido', data: horarioAgregado });
}
function update(req, res) {
    req.body.sanitizedInput.id = req.params.id;
    const deporte = repository.update(req.body.sanitizedInput);
    if (!deporte) {
        return res.status(404).send({ message: 'Deporte no encontrado' });
    }
    return res.status(200).send({ message: 'Deportes actualizado exitosamente', data: deporte });
}
function remove(req, res) {
    const id = req.params.id;
    const deporte = repository.delete({ id });
    if (!deporte) {
        res.status(404).send({ message: 'Deporte no encontrado' });
    }
    else {
        res.status(200).send({ message: 'Deporte eliminado exitosamente' });
    }
}
export { sanitizeHorarioInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=horario.controler.js.map