import { Treatment } from './treatment.entity.js';
import { orm } from '../shared/orm.js';
const em = orm.em;
function sanitizeTreatmentInput(req, res, next) {
    req.body.sanitizedInput = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
async function findAll(req, res) {
    try {
        const treatments = await em.find(Treatment, {});
        res.status(200).json({ message: 'found all treatments', data: treatments });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const treatment = await em.findOneOrFail(Treatment, { id });
        res.status(200).json({ message: 'found treatment', data: treatment });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const treatment = em.create(Treatment, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: 'Treatment created', data: treatment });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const treatmentToUpdate = await em.findOneOrFail(Treatment, { id });
        em.assign(treatmentToUpdate, req.body.sanitizedInput);
        await em.flush();
        res
            .status(200)
            .json({ message: 'treatment updated', data: treatmentToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const treatment = em.getReference(Treatment, id);
        await em.removeAndFlush(treatment);
        res.status(200).json({ message: 'Treatment deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeTreatmentInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=treatment.controller.js.map