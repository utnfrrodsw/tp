import { Tarea } from './tarea.entity.js';
import { orm } from '../shared/db/orm.js';
const em = orm.em;
function sanitizeTareaInput(req, res, next) {
    req.body.sanitizeTareaInput = {
        nombreTarea: req.body.nombreTarea,
        descripcionTarea: req.body.descripcionTarea,
        duracionTarea: req.body.duracionTarea,
        servicio: req.body.servicio
    };
    Object.keys(req.body.sanitizeTareaInput).forEach((key) => {
        if (req.body.sanitizeTareaInput[key] === undefined) {
            delete req.body.sanitizeTareaInput[key];
        }
    });
    next();
}
async function findall(req, res) {
    try {
        const tasks = await em.find(Tarea, {}, { populate: ['servicio'] });
        res.status(200).json({ message: 'found all tasks', data: tasks });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findone(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const task = await em.findOneOrFail(Tarea, { id }, { populate: ['servicio'] });
        res.status(200).json({ message: 'found one task', data: task });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const tasks = em.create(Tarea, req.body.sanitizeTareaInput);
        await em.persistAndFlush(tasks);
        res.status(201).json({ message: 'created task', data: tasks });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const task = await em.findOneOrFail(Tarea, { id });
        em.assign(task, req.body.sanitizeTareaInput);
        await em.flush();
        res.status(200).json({ message: 'updated task', data: task });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const task = await em.findOneOrFail(Tarea, { id });
        await em.removeAndFlush(task);
        res.status(200).json({ message: 'deleted task', data: task });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeTareaInput, findall, findone, add, update, remove };
//# sourceMappingURL=tarea.controler.js.map