import { EditorialRepository } from "./Editorial.repository.js";
import { Editorial } from "./Editorial.js";

const repository = new EditorialRepository();

async function sanitizeInput(req, res, next) {
    try {
        req.body.sanitizedInput = {
            name: req.body.name,
            categoria: req.body.categoria,
            id: req.body.id,
        };

        // Eliminar claves no definidas
        Object.keys(req.body.sanitizedInput).forEach(key => {
            if (req.body.sanitizedInput[key] === undefined) {
                delete req.body.sanitizedInput[key];
            }
        });

        next();
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

// Obtener todas las editoriales
async function findAll(req, res) {
    try {
        const data = await repository.findAll();
        res.json({ data });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

// Obtener una editorial por su id
async function findOne(req, res) {
    try {
        const id = req.params.id;
        const editorial = await repository.findOne({ id });
        if (!editorial) {
            return res.status(404).send({ message: "Editorial no encontrada." });
        }
        return res.json({ data: editorial });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

// Añadir una nueva editorial
async function add(req, res) {
    try {
        const input = req.body.sanitizedInput;
        const editorialInput = new Editorial(input.name, input.categoria, input.id);
        const editorial = await repository.add(editorialInput);
        res.status(201).send({ message: 'Editorial agregada con éxito.', data: editorial });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

// Actualizar una editorial existente
async function update(req, res) {
    try {
        const editorial = await repository.update(req.params.id, req.body.sanitizedInput);
        if (!editorial) {
            return res.status(404).send({ message: "Editorial no encontrada." });
        }
        return res.status(200).send({ message: 'Editorial actualizada con éxito.', data: editorial });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

// Eliminar una editorial
async function remove(req, res) {
    try {
        const id = req.params.id;
        const editorial = await repository.delete({ id });
        if (!editorial) {
            return res.status(404).send({ message: "Editorial no encontrada." });
        }
        return res.status(204).send({ message: 'Editorial eliminada con éxito.' });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

export { sanitizeInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=Editorial.controler.js.map