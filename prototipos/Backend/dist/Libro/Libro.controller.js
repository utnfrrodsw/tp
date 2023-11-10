import { LibroRepository } from "./Libro.repository.js";
import { Libro } from "./Libro.js";
import { ObjectId } from "mongodb";
const repository = new LibroRepository();
async function sanitizeInput(req, res, next) {
    try {
        const requiredKeys = ['isbn', 'titulo', 'idioma', 'descripcion', 'precio', 'fecha_edicion', 'autores', 'editorial', 'categorias', 'formatos', 'portada', 'calificacion'];
        req.body.sanitizedInput = {};
        for (const key of requiredKeys) {
            if (req.body[key] === undefined) {
                return res.status(400).send({ message: `Campo '${key}' es requerido.` });
            }
            req.body.sanitizedInput[key] = req.body[key];
        }
        next();
    }
    catch (error) {
        console.error("Error en sanitizeInput:", error);
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
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function findOne(req, res) {
    try {
        const id = req.params.id;
        const libro = await repository.findOne({ id });
        if (!libro) {
            return res.status(404).send({ message: "Libro no encontrado." });
        }
        return res.json({ data: libro });
    }
    catch (error) {
        console.error("Error en findOne:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function add(req, res) {
    try {
        const input = req.body.sanitizedInput;
        const libroInput = new Libro(input.isbn, input.titulo, input.idioma, input.descripcion, input.precio, input.fecha_edicion, input.autores.map((autorId) => new ObjectId(autorId)), new ObjectId(input.editorial), input.categorias.map((categoriaId) => new ObjectId(categoriaId)), input.formatos.map((formatoId) => new ObjectId(formatoId)), input.portada, input.calificacion);
        const libro = await repository.add(libroInput);
        res.status(201).send({ message: 'Libro agregado con éxito.', data: libro });
    }
    catch (error) {
        console.error("Error en add:", error);
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
            const objectIdLibroId = new ObjectId(libroId);
            const libroInput = new Libro(updatedData.isbn, updatedData.titulo, updatedData.idioma, updatedData.descripcion, updatedData.precio, updatedData.fecha_edicion, updatedData.autores, updatedData.editorial, updatedData.categorias, updatedData.formatos, updatedData.portada, updatedData.calificacion, objectIdLibroId);
            const nuevoLibro = await repository.add(libroInput);
            if (!nuevoLibro) {
                return res.status(500).send({ message: "Error al crear el nuevo libro." });
            }
            return res.status(201).send({ message: 'Libro creado con éxito.', data: nuevoLibro });
        }
        // Si el libro existe, lo actualiza
        const updatedLibro = await repository.update(libroId, updatedData);
        if (!updatedLibro) {
            return res.status(500).send({ message: "Error al actualizar el libro." });
        }
        return res.status(200).send({ message: 'Libro actualizado con éxito.', data: updatedLibro });
    }
    catch (error) {
        console.error("Error en update:", error);
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
        console.error("Error en remove:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function findByEditorial(req, res) {
    try {
        const editorialId = req.params.editorialId;
        const libros = await repository.findByEditorial(editorialId);
        if (!libros || libros.length === 0) {
            return res.status(404).send({ message: "No se encontraron libros para la editorial proporcionada." });
        }
        res.status(200).send({ message: 'Libros encontrados con éxito.', data: libros });
    }
    catch (error) {
        console.error("Error en findByEditorial:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function findByAutor(req, res) {
    try {
        const autorId = req.params.autorId;
        const libros = await repository.findByAutor(autorId);
        if (!libros || libros.length === 0) {
            return res.status(404).send({ message: "No se encontraron libros para el autor proporcionado." });
        }
        res.status(200).send({ message: 'Libros encontrados con éxito.', data: libros });
    }
    catch (error) {
        console.error("Error en findByAutor:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function findByCategoria(req, res) {
    try {
        const categoriaId = req.params.categoriaId;
        const libros = await repository.findByCategoria(categoriaId);
        if (!libros || libros.length === 0) {
            return res.status(404).send({ message: "No se encontraron libros para la categoría proporcionada." });
        }
        res.status(200).send({ message: 'Libros encontrados con éxito.', data: libros });
    }
    catch (error) {
        console.error("Error en findByCategoria:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function findByFormatoLibro(req, res) {
    try {
        const formatoId = req.params.formatoId;
        const libros = await repository.findByFormatoLibro(formatoId);
        if (!libros || libros.length === 0) {
            return res.status(404).send({ message: "No se encontraron libros para el formato proporcionado." });
        }
        res.status(200).send({ message: 'Libros encontrados con éxito.', data: libros });
    }
    catch (error) {
        console.error("Error en findByFormatoLibro:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getLibros(req, res) {
    try {
        const libros = await repository.findAll();
        const libroIds = libros?.map((libro) => libro._id);
        res.json({ data: libroIds });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getIsbn(req, res) {
    try {
        const id = req.params.id;
        const libro = await repository.findOne({ id });
        if (!libro) {
            return res.status(404).send({ message: "Libro no encontrado." });
        }
        res.json({ data: libro.isbn });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getTitulo(req, res) {
    try {
        const id = req.params.id;
        const libro = await repository.findOne({ id });
        if (!libro) {
            return res.status(404).send({ message: "Libro no encontrado." });
        }
        res.json({ data: libro.titulo });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getIdioma(req, res) {
    try {
        const id = req.params.id;
        const libro = await repository.findOne({ id });
        if (!libro) {
            return res.status(404).send({ message: "Libro no encontrado." });
        }
        res.json({ data: libro.idioma });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getDescripcion(req, res) {
    try {
        const id = req.params.id;
        const libro = await repository.findOne({ id });
        if (!libro) {
            return res.status(404).send({ message: "Libro no encontrado." });
        }
        res.json({ data: libro.descripcion });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getPrecio(req, res) {
    try {
        const id = req.params.id;
        const libro = await repository.findOne({ id });
        if (!libro) {
            return res.status(404).send({ message: "Libro no encontrado." });
        }
        res.json({ data: libro.precio });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getFechaEdicion(req, res) {
    try {
        const id = req.params.id;
        const libro = await repository.findOne({ id });
        if (!libro) {
            return res.status(404).send({ message: "Libro no encontrado." });
        }
        res.json({ data: libro.fecha_edicion });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getAutores(req, res) {
    try {
        const id = req.params.id;
        const libro = await repository.findOne({ id });
        if (!libro) {
            return res.status(404).send({ message: "Libro no encontrado." });
        }
        res.json({ data: libro.autores });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getCategorias(req, res) {
    try {
        const id = req.params.id;
        const libro = await repository.findOne({ id });
        if (!libro) {
            return res.status(404).send({ message: "Libro no encontrado." });
        }
        res.json({ data: libro.categorias });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getFormatos(req, res) {
    try {
        const id = req.params.id;
        const libro = await repository.findOne({ id });
        if (!libro) {
            return res.status(404).send({ message: "Libro no encontrado." });
        }
        res.json({ data: libro.formatos });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getEditorial(req, res) {
    try {
        const id = req.params.id;
        const libro = await repository.findOne({ id });
        if (!libro) {
            return res.status(404).send({ message: "Libro no encontrado." });
        }
        res.json({ data: libro.editorial });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getPortada(req, res) {
    try {
        const id = req.params.id;
        const libro = await repository.findOne({ id });
        if (!libro) {
            return res.status(404).send({ message: "Libro no encontrado." });
        }
        res.json({ data: libro.portada });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getCalificacion(req, res) {
    try {
        const id = req.params.id;
        const libro = await repository.findOne({ id });
        if (!libro) {
            return res.status(404).send({ message: "Libro no encontrado." });
        }
        res.json({ data: libro.calificacion });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
export { sanitizeInput, findAll, findOne, add, update, remove, findByEditorial, findByAutor, findByCategoria, findByFormatoLibro, getLibros, getIsbn, getTitulo, getIdioma, getDescripcion, getPrecio, getFechaEdicion, getAutores, getEditorial, getCategorias, getFormatos, getPortada, getCalificacion };
//# sourceMappingURL=Libro.controller.js.map