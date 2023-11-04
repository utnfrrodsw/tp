import { Request, Response, NextFunction } from "express"
import { LibroRepository } from "./Libro.repository.js"
import { Libro } from "./Libro.js"

const repository = new LibroRepository()

async function sanitizeInput(req: Request, res: Response, next: NextFunction) {
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
                delete req.body.sanitizedInput[key]
            }
        });

        next();
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findAll(req: Request, res: Response) {
    try {
        const data = await repository.findAll();
        res.json({ data });
    } catch (error) {
        console.error("Error en findAll:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}


async function findOne(req: Request, res: Response) {
    try {
        const id = req.params.id
        const libro = await repository.findOne({ id })
        if (!libro) {
            return res.status(404).send({ message: "Libro no encontrado" })
        }
        return res.json({ data: libro })
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function add(req: Request, res: Response) {
    try {
        const input = req.body.sanitizedInput
        const libroInput = new Libro(
            input.id,
            input.isbn,
            input.titulo,
            input.idioma,
            input.descripcion,
            input.precio,
            input.fecha_edicion,
            input.autores,
            input.editorial,
            input.categorias,
            input.formatos,
        )
        const libro = await repository.add(libroInput)
        res.status(201).send({ message: 'Libro agregado con éxito.', data: libro })
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function update(req: Request, res: Response) {
    try {
        const libro = await repository.update(req.params.id, req.body.sanitizedInput)
        if (!libro) {
            return res.status(404).send({ message: "Libro no encontrado." })
        }
        return res.status(200).send({ message: 'Libro actualizado con éxito.', data: libro })
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id
        const libro = await repository.delete({ id })
        if (!libro) {
            res.status(404).send({ message: "Libro no encontrado." })
        }
        res.status(204).send({ message: 'Libro eliminado con éxito.' })
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

export { sanitizeInput, findAll, findOne, add, update, remove }