import { LibroRepository } from "./Libro.repository.js";
import { Libro } from "./Libro.js";
import { ObjectId } from "mongodb";
const repository = new LibroRepository();
async function sanitizeInput(req, res, next) {
    try {
        req.body.sanitizedInput = {
            id: req.body.id,
            isbn: req.body.isbn,
            titulo: req.body.titulo,
            idioma: req.body.idioma,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            fecha_edicion: req.body.fecha_edicion,
            autores: req.body.autores,
            editorial: req.body.editorial,
            categorias: req.body.categorias,
            formatos: req.body.formatos,
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
        console.error("Error en findAll:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}
async function findOne(req, res) {
    try {
        const id = req.params.id;
        const libro = await repository.findOne({ id });
        if (!libro) {
            return res.status(404).send({ message: "Libro no encontrado" });
        }
        return res.json({ data: libro });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function add(req, res) {
    try {
        const input = req.body.sanitizedInput;
        // Verificar la existencia de los autores en la base de datos
        const autoresExisten = await Promise.all(input.autores.map((autorId) => repository.autorExiste(autorId)));
        if (autoresExisten.includes(false)) {
            return res.status(400).send({ message: 'Al menos uno de los autores no existe.' });
        }
        // Verificar la existencia de la editorial en la base de datos
        const editorialExiste = await repository.editorialExiste(input.editorial);
        if (!editorialExiste) {
            return res.status(400).send({ message: 'La editorial no existe.' });
        }
        const libroInput = new Libro(input.isbn, input.titulo, input.idioma, input.descripcion, input.precio, input.fecha_edicion, input.autores.map((autorId) => new ObjectId(autorId)), new ObjectId(input.editorial), input.categorias, input.formatos);
        const libro = await repository.add(libroInput);
        res.status(201).send({ message: 'Libro agregado con éxito.', data: libro });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function update(req, res) {
    try {
        const libroId = req.params.id;
        const updatedData = req.body.sanitizedInput;
        // Verificar si el libro existe antes de intentar actualizarlo
        const libroExiste = await repository.findOne({ id: libroId });
        if (!libroExiste) {
            return res.status(404).send({ message: "Libro no encontrado." });
        }
        // Validar que los autores existan
        const autoresExisten = await Promise.all(updatedData.autores.map((autorId) => repository.autorExiste(autorId)));
        if (autoresExisten.includes(false)) {
            return res.status(400).send({ message: 'Al menos uno de los autores no existe.' });
        }
        // Validar que la editorial exista
        const editorialExiste = await repository.editorialExiste(updatedData.editorial);
        if (!editorialExiste) {
            return res.status(400).send({ message: 'La editorial no existe.' });
        }
        // Actualizar el libro
        const updatedLibro = await repository.update(libroId, updatedData);
        if (!updatedLibro) {
            return res.status(500).send({ message: "Error al actualizar el libro." });
        }
        return res.status(200).send({ message: 'Libro actualizado con éxito.', data: updatedLibro });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function remove(req, res) {
    try {
        const id = req.params.id;
        const libro = await repository.delete({ id });
        if (!libro) {
            res.status(404).send({ message: "Libro no encontrado." });
        }
        res.status(204).send({ message: 'Libro eliminado con éxito.' });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
export { sanitizeInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=Libro.controller.js.map