import { Request, Response, NextFunction } from "express";
import { LibroRepository } from "./Libro.repository.js";
import { Libro } from "./Libro.js";
import { ObjectId } from "mongodb";

const repository = new LibroRepository();

async function sanitizeInput(req: Request, res: Response, next: NextFunction) {
    try {
        req.body.sanitizedInput = {
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
            portada: req.body.portada,
            calificacion: req.body.portada
        };

        // Eliminar claves no definidas
        Object.keys(req.body.sanitizedInput).forEach(key => {
            if (req.body.sanitizedInput[key] === undefined) {
                delete req.body.sanitizedInput[key];
            }
        });

        next();
    } catch (error) {
        console.error("Error en sanitizeInput:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findAll(req: Request, res: Response) {
    try {
        const data = await repository.findAll();
        res.json({ data });
    } catch (error) {
        console.error("Error en findAll:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const libro = await repository.findOne({ id });
        if (!libro) {
            return res.status(404).send({ message: "Libro no encontrado." });
        }
        return res.json({ data: libro });
    } catch (error) {
        console.error("Error en findOne:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function add(req: Request, res: Response) {
    try {
        const input = req.body.sanitizedInput;

        const libroInput = new Libro(
            input.isbn,
            input.titulo,
            input.idioma,
            input.descripcion,
            input.precio,
            input.fecha_edicion,
            input.autores.map((autorId: string) => new ObjectId(autorId)),
            new ObjectId(input.editorial),
            input.categorias,
            input.formatos,
            input.portada,
            input.calificacion
        );

        const libro = await repository.add(libroInput);
        res.status(201).send({ message: 'Libro agregado con éxito.', data: libro });
    } catch (error) {
        console.error("Error en add:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function update(req: Request, res: Response) {
    try {
        const libroId = req.params.id;
        const updatedData = req.body.sanitizedInput;

        // Verificar si el libro existe antes de intentar actualizarlo
        const libroExiste = await repository.findOne({ id: libroId });
        if (!libroExiste) {
            return res.status(404).send({ message: "Libro no encontrado." });
        }

        // Actualizar el libro
        const updatedLibro = await repository.update(libroId, updatedData);

        if (!updatedLibro) {
            return res.status(500).send({ message: "Error al actualizar el libro." });
        }

        return res.status(200).send({ message: 'Libro actualizado con éxito.', data: updatedLibro });

    } catch (error) {
        console.error("Error en update:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const libro = await repository.delete({ id });
        if (!libro) {
            res.status(404).send({ message: "Libro no encontrado." });
        }
        res.status(204).send({ message: 'Libro eliminado con éxito.' });
    } catch (error) {
        console.error("Error en remove:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findByEditorial(req: Request, res: Response) {
    try {
        const editorialId = req.params.editorialId;
        const libros = await repository.findByEditorial(editorialId);
        if (!libros || libros.length === 0) {
            return res.status(404).send({ message: "No se encontraron libros para la editorial proporcionada." });
        }
        res.status(200).send({ message: 'Libros encontrados con éxito.', data: libros });
    } catch (error) {
        console.error("Error en findByEditorial:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findByAutor(req: Request, res: Response) {
    try {
        const autorId = req.params.autorId;
        const libros = await repository.findByAutor(autorId);

        if (!libros || libros.length === 0) {
            return res.status(404).send({ message: "No se encontraron libros para el autor proporcionado." });
        }

        res.status(200).send({ message: 'Libros encontrados con éxito.', data: libros });
    } catch (error) {
        console.error("Error en findByAutor:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findByCategoria(req: Request, res: Response) { // TODO: Arreglar este método (no devuelve nada)
    try {
        const categoriaId = req.params.categoriaId;
        const libros = await repository.findByCategoria(categoriaId);

        if (!libros || libros.length === 0) {
            return res.status(404).send({ message: "No se encontraron libros para la categoría proporcionada." });
        }

        res.status(200).send({ message: 'Libros encontrados con éxito.', data: libros });
    } catch (error) {
        console.error("Error en findByCategoria:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findByFormatoLibro(req: Request, res: Response) { // TODO: Arreglar este método (no devuelve nada)
    try {
        const formatoId = req.params.formatoId;
        const libros = await repository.findByFormatoLibro(formatoId);

        if (!libros || libros.length === 0) {
            return res.status(404).send({ message: "No se encontraron libros para el formato proporcionado." });
        }

        res.status(200).send({ message: 'Libros encontrados con éxito.', data: libros });
    } catch (error) {
        console.error("Error en findByFormatoLibro:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}


export { sanitizeInput, findAll, findOne, add, update, remove, findByEditorial, findByAutor, findByCategoria, findByFormatoLibro }