import { Specialty } from './specialty.entity.js';
import { orm } from '../shared/orm.js';
const em = orm.em;
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
async function findAll(req, res) {
    try {
        const specialties = await em.find(Specialty, {});
        res.status(200).json({ message: 'Found all specialties', data: specialties });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const speacialty = await em.find(Specialty, { id });
        res.status(200).json({ message: 'Found speacialty', data: speacialty });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const specialty = em.create(Specialty, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: 'Specialty created', data: specialty });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const SpecialtyToUpdate = await em.findOneOrFail(Specialty, { id });
        em.assign(SpecialtyToUpdate, req.body.sanitizedInput);
        await em.flush();
        res.status(200).json({ message: 'Specialty updated', data: SpecialtyToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const specialty = em.getReference(Specialty, id);
        await em.removeAndFlush(specialty);
        res.status(200).json({ message: 'Specialty deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeSpecialtyInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=specialty.controller.js.map