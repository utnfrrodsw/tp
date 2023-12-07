import { Request, Response, NextFunction } from "express"
import { AutorRepository } from "./Autor.repository.js"
import { Autor } from "./Autor.js"
import { ObjectId } from "mongodb"

const repository = new AutorRepository()

async function sanitizeInput(req: Request, res: Response, next: NextFunction) {
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
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findAll(req: Request, res: Response) {
    try {
        const data = await repository.findAll();
        res.json({ data });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const autor = await repository.findOne({ id });
        if (!autor) {
            return res.status(404).send({ message: "Autor no encontrado." });
        }
        return res.json({ data: autor });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function add(req: Request, res: Response) {
    try {
        const input = req.body.sanitizedInput;
        const autorInput = new Autor(input.nombreCompleto, input.perfil, input.info);
        const autor = await repository.add(autorInput);
        res.status(201).send({ message: 'Autor agregado con éxito.', data: autor });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function update(req: Request, res: Response) {
    try {
        const autorId = req.params.id;
        const updatedData = req.body.sanitizedInput;

        // Verificar si el autor existe antes de intentar actualizarlo
        const autorExiste = await repository.findOne({ id: autorId });

        if (!autorExiste) {
            const objectIdAutorId = new ObjectId(autorId);
            const autorInput = new Autor(
                updatedData.nombreCompleto,
                updatedData.perfil,
                updatedData.info,
                objectIdAutorId
            );

            const nuevoAutor = await repository.add(autorInput);

            if (!nuevoAutor) {
                return res.status(500).send({ message: "Error al crear el nuevo autor." });
            }

            return res.status(201).send({ message: 'Autor creado con éxito.', data: nuevoAutor });
        }

        // Si el autor existe, lo actualiza
        const updatedAutor = await repository.update(autorId, updatedData);

        if (!updatedAutor) {
            return res.status(500).send({ message: "Error al actualizar el autor." });
        }

        return res.status(200).send({ message: 'Autor actualizado con éxito.', data: updatedAutor });

    } catch (error) {
        console.error("Error en update:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}


async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const autor = await repository.delete({ id });
        if (!autor) {
            return res.status(404).send({ message: "Autor no encontrado." });
        }
        return res.status(204).send({ message: 'Autor eliminado con éxito.' });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

// OTROS MÉTODOS


async function getAutores(req: Request, res: Response) {
    try {
        const autores = await repository.findAll();
        const autorIds = autores?.map((autor) => autor._id);
        res.json({ data: autorIds });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function getNombreCompleto(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const autor = await repository.findOne({ id });
        if (!autor) {
            return res.status(404).send({ message: "Autor no encontrado." });
        }
        res.json({ data: autor.nombreCompleto });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function getInfo(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const autor = await repository.findOne({ id });
        if (!autor) {
            return res.status(404).send({ message: "Autor no encontrado." });
        }
        res.json({ data: autor.info });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function getPerfil(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const autor = await repository.findOne({ id });
        if (!autor) {
            return res.status(404).send({ message: "Autor no encontrado." });
        }
        res.json({ data: autor.perfil });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findOneByNombreCompleto(req: Request, res: Response) {
    try {
        const nombreCompleto = req.params.nombreCompleto;

        const autor = await repository.findOneByNombreCompleto({ nombreCompleto });

        if (!autor) {
            return res.status(404).send({ message: "Autor no encontrado." });
        }

        return res.json({ data: autor });
    } catch (error) {
        console.error("Error en findOneByNombreCompleto:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

export { sanitizeInput, findAll, findOne, add, update, remove, getAutores, getNombreCompleto, getPerfil, getInfo, findOneByNombreCompleto }
