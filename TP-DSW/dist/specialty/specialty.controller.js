import { Specialty } from './specialty.entity.js';
import { SpecialtyRepository } from './specialty.repository.js';
const repository = new SpecialtyRepository();
function sanitizeSpecialtyInput(req, res, next) {
    req.body.sanitizedInput = {
        id: req.body.id,
        name: req.body.name,
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
    const specialty = repository.findOne({ id });
    if (!specialty) {
        return res.status(404).send({ message: 'Specialty not found' });
    }
    res.json({ data: specialty });
}
function add(req, res) {
    const input = req.body.sanitizedInput;
    const specialtyInput = new Specialty(input.id, input.name);
    const specialty = repository.add(specialtyInput);
    return res.status(201).send({ message: 'Specialty created successfully', data: specialty });
}
function update(req, res) {
    req.body.sanitizedInput.id = req.params.id;
    const specialty = repository.update(req.body.sanitizedInput);
    if (!specialty) {
        return res.status(404).send({ message: 'Specialty not found' });
    }
    return res.status(200).send({ message: 'Specialty updated successfully', data: specialty });
}
function remove(req, res) {
    const id = req.params.id;
    const specialty = repository.delete({ id });
    if (specialty === undefined) {
        res.status(404).send({ message: "Specialty not found" });
    }
    else {
        res.status(200).send({ message: "Specialty deleted" });
    }
}
export { sanitizeSpecialtyInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=specialty.controller.js.map