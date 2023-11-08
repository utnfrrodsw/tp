import { AutorRepository } from "./Autor.repository.js";
import { Autor } from "./Autor.js";
const repository = new AutorRepository();
async function sanitizeInput(req, res, next) {
    try {
        req.body.sanitizedInput = {
            nombreCompleto: req.body.nombreCompleto,
            perfil: req.body.perfil,
            info: req.body.info,
        };
        // Eliminar claves no definidas
        Object.keys(req.body.sanitizedInput).forEach(key => {
            if (req.body.sanitizedInput[key] === undefined) {
                delete req.body.sanitizedInput[key];
            }
        });
        next();
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function findAll(req, res) {
    try {
        const data = await repository.findAll();
        res.json({ data });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function findOne(req, res) {
    try {
        const id = req.params.id;
        const autor = await repository.findOne({ id });
        if (!autor) {
            return res.status(404).send({ message: "Autor no encontrado." });
        }
        return res.json({ data: autor });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function add(req, res) {
    try {
        const input = req.body.sanitizedInput;
        const autorInput = new Autor(input.nombreCompleto, input.perfil, input.info);
        const autor = await repository.add(autorInput);
        res.status(201).send({ message: 'Autor agregado con éxito.', data: autor });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function update(req, res) {
    try {
        const autor = await repository.update(req.params.id, req.body.sanitizedInput);
        if (!autor) {
            return res.status(404).send({ message: "Autor no encontrado." });
        }
        return res.status(200).send({ message: 'Autor actualizado con éxito.', data: autor });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function remove(req, res) {
    try {
        const id = req.params.id;
        const autor = await repository.delete({ id });
        if (!autor) {
            return res.status(404).send({ message: "Autor no encontrado." });
        }
        return res.status(204).send({ message: 'Autor eliminado con éxito.' });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
// OTROS MÉTODOS
async function getAutores(req, res) {
    try {
        const autores = await repository.findAll();
        const autorIds = autores?.map((autor) => autor._id);
        res.json({ data: autorIds });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getNombreCompleto(req, res) {
    try {
        const id = req.params.id;
        const autor = await repository.findOne({ id });
        if (!autor) {
            return res.status(404).send({ message: "Autor no encontrado." });
        }
        res.json({ data: autor.nombreCompleto });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getPerfil(req, res) {
    try {
        const id = req.params.id;
        const autor = await repository.findOne({ id });
        if (!autor) {
            return res.status(404).send({ message: "Autor no encontrado." });
        }
        res.json({ data: autor.perfil });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
export { sanitizeInput, findAll, findOne, add, update, remove, getAutores, getNombreCompleto, getPerfil };
//# sourceMappingURL=Autor.controller.js.map