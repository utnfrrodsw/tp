import { CategoriaRepository } from "./Categoria.repository.js";
import { Categoria } from "./Categoria.js";
import { ObjectId } from "mongodb";
const repository = new CategoriaRepository();
async function sanitizeInput(req, res, next) {
    try {
        req.body.sanitizedInput = {
            descripcion: req.body.descripcion,
        };
        Object.keys(req.body.sanitizedInput).forEach((key) => {
            if (req.body.sanitizedInput[key] === undefined) {
                delete req.body.sanitizedInput[key];
            }
        });
        next();
    }
    catch (error) {
        console.error("Error en sanitizeInput:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}
async function findAll(req, res) {
    try {
        res.json({ data: await repository.findAll() });
    }
    catch (error) {
        console.error("Error en findAll:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}
async function findOne(req, res) {
    try {
        const id = req.params.id;
        const categoria = await repository.findOne({ id });
        if (!categoria) {
            return res.status(404).send({ message: "Categoría no encontrada" });
        }
        return res.json({ data: categoria });
    }
    catch (error) {
        console.error("Error en findOne:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}
async function add(req, res) {
    try {
        const input = req.body.sanitizedInput;
        const categoriaInput = new Categoria(input.descripcion, input.id);
        const categoria = await repository.add(categoriaInput);
        res.status(201).send({ message: 'Categoría agregada con éxito', data: categoria });
    }
    catch (error) {
        console.error("Error en add:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}
async function update(req, res) {
    try {
        const categoriaId = req.params.id;
        const updatedData = req.body.sanitizedInput;
        // Verificar si la categoría existe antes de intentar actualizarlo
        const categoriaExiste = await repository.findOne({ id: categoriaId });
        if (!categoriaExiste) {
            const objectIdCategoriaId = new ObjectId(categoriaId);
            const categoriaInput = new Categoria(updatedData.descripcion, objectIdCategoriaId);
            const nuevaCategoria = await repository.add(categoriaInput);
            if (!nuevaCategoria) {
                return res.status(500).send({ message: "Error al crear la nueva categoría." });
            }
            return res.status(201).send({ message: 'Categoría creada con éxito.', data: nuevaCategoria });
        }
        // Si la categoria existe, la actualiza
        const updatedCategoria = await repository.update(categoriaId, updatedData);
        if (!updatedCategoria) {
            return res.status(500).send({ message: "Error al actualizar la categoría." });
        }
        return res.status(200).send({ message: 'Categoría actualizada con éxito.', data: updatedCategoria });
    }
    catch (error) {
        console.error("Error en update:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function remove(req, res) {
    try {
        const id = req.params.id;
        const categoria = await repository.delete({ id });
        if (!categoria) {
            res.status(404).send({ message: "Categoría no encontrada" });
        }
        res.status(204).send({ message: 'Categoría eliminada con éxito' });
    }
    catch (error) {
        console.error("Error en remove:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}
// OTROS MÉTODOS
async function obtenerDescripcionesCategoria(req, res) {
    try {
        const categoria = await repository.findAll();
        if (categoria) {
            const descripciones = categoria.map((categoria) => categoria.descripcion);
            res.json(descripciones);
        }
        else {
            res.status(404).send({ message: "No se encontraron categorías" });
        }
    }
    catch (error) {
        console.error("Error en obtener las descripciones de las categorías:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}
async function getDescripcion(req, res) {
    try {
        const id = req.params.id;
        const categoria = await repository.findOne({ id });
        if (!categoria) {
            return res.status(404).send({ message: "Categoría no encontrada." });
        }
        res.json({ data: categoria.descripcion });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
export { sanitizeInput, findAll, findOne, add, update, remove, obtenerDescripcionesCategoria, getDescripcion };
//# sourceMappingURL=Categoria.controller.js.map