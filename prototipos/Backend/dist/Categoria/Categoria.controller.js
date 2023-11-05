import { CategoriaRepository } from "./Categoria.repository.js";
import { Categoria } from "./Categoria.js";

const repository = new CategoriaRepository();

async function sanitizeInput(req, res, next) {
    try {
        req.body.sanitizedInput = {
            id: req.body.id,
            descripcion: req.body.descripcion,
        };

        // Elimina las claves no definidas
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

// Encuentra todas las categorías
async function findAll(req, res) {
    try {
        const data = await repository.findAll();
        res.json({ data });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

// Encuentra una categoría por su id
async function findOne(req, res) {
    try {
        const id = req.params.id;
        const categoria = await repository.findOne({ id });
        if (!categoria) {
            return res.status(404).send({ message: "Categoría no encontrada." });
        }
        return res.json({ data: categoria });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

// Añade una nueva categoría
async function add(req, res) {
    try {
        const input = req.body.sanitizedInput;
        const categoriaInput = new Categoria(input.id, input.descripcion);
        const categoria = await repository.add(categoriaInput);
        res.status(201).send({ message: 'Categoría agregada con éxito.', data: categoria });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

// Actualiza una categoría existente
async function update(req, res) {
    try {
        const categoria = await repository.update(req.params.id, req.body.sanitizedInput);
        if (!categoria) {
            return res.status(404).send({ message: "Categoría no encontrada." });
        }
        return res.status(200).send({ message: 'Categoría actualizada con éxito.', data: categoria });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

// Elimina una categoría
async function remove(req, res) {
    try {
        const id = req.params.id;
        const categoria = await repository.delete({ id });
        if (!categoria) {
            return res.status(404).send({ message: "Categoría no encontrada." });
        }
        return res.status(204).send({ message: 'Categoría eliminada con éxito.' });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

export { sanitizeInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=Categoria.controler.js.map