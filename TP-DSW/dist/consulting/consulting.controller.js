import { Consulting } from './consulting.entity.js';
import { ConsultingRepository } from './consulting.repository.js';
const repository = new ConsultingRepository();
function sanitizeConsultingInput(req, res, next) {
    req.body.sanitizedInput = {
        id: req.body.id,
        street: req.body.street,
        altStreet: req.body.altStreet,
    };
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
    const consulting = repository.findOne({ id });
    if (!consulting) {
        return res.status(404).send({ message: 'Consulting not found' });
    }
    res.json({ data: consulting });
}
function add(req, res) {
    const input = req.body.sanitizedInput;
    const consultingInput = new Consulting(input.id, input.street, input.altStreet);
    const consulting = repository.add(consultingInput);
    return res
        .status(201)
        .send({ message: 'Consulting created successfully', data: consulting });
}
function update(req, res) {
    req.body.sanitizedInput.id = req.params.id;
    const consulting = repository.update(req.body.sanitizedInput);
    if (!consulting) {
        return res.status(404).send({ message: 'Consulting not found' });
    }
    return res
        .status(200)
        .send({ message: 'Consulting updated successfully', data: consulting });
}
function remove(req, res) {
    const id = req.params.id;
    const consulting = repository.delete({ id });
    if (consulting === undefined) {
        res.status(404).send({ message: 'consulting not found' });
    }
    else {
        res.status(200).send({ message: 'consulting deleted' });
    }
}
export { sanitizeConsultingInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=consulting.controller.js.map