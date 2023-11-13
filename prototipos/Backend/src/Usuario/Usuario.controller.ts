import { Request, Response, NextFunction } from "express"
import { UsuarioRepository } from "./Usuario.repository.js"
import { Usuario } from "./Usuario.js"
import { ObjectId } from "mongodb";

const repository = new UsuarioRepository()

async function sanitizeInput(req: Request, res: Response, next: NextFunction) {
    try {
        const requiredKeys = ['id', 'nombre', 'apellido', 'email', 'direccion', 'localidad', 'avatar', 'tipo'];

        req.body.sanitizedInput = {};

        for (const key of requiredKeys) {
            if (req.body[key] === undefined) {
                return res.status(400).send({ message: `Campo '${key}' es requerido.` });
            }

            req.body.sanitizedInput[key] = req.body[key];
        }

        next();
    } catch (error) {
        console.error("Error en sanitizeInput:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findAll(req: Request, res: Response) {
    try {
        res.json({ data: await repository.findAll() })
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = req.params.id
        const usuario = await repository.findOne({ id })
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." })
        }
        return res.json({ data: usuario })
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function add(req: Request, res: Response) {
    try {
        const input = req.body.sanitizedInput
        const usuarioInput = new Usuario(
            input.id,
            input.nombre,
            input.apellido,
            input.email,
            input.direccion,
            new ObjectId(input.localidad),
            input.avatar,
            input.tipo,
        )
        const usuario = await repository.add(usuarioInput)
        res.status(201).send({ message: 'Usuario agregado con éxito.', data: usuario })
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function update(req: Request, res: Response) {
    try {
        const usuario = await repository.update(req.params.id, req.body.sanitizedInput)
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." })
        }
        return res.status(200).send({ message: 'Usuario actualizado con éxito.', data: usuario })
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id
        const usuario = await repository.delete({ id })
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." })
        }
        res.status(204).send({ message: 'Usuario eliminado con éxito.' })
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}



export { sanitizeInput, findAll, findOne, add, update, remove }