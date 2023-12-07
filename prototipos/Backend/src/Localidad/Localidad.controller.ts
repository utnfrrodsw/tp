import { Request, Response, NextFunction } from "express";
import { LocalidadRepository } from "./Localidad.repository.js";
import { Localidad } from "./Localidad.entity.js";
import { ObjectId } from "mongodb";

const repository = new LocalidadRepository();

async function sanitizeInput(req: Request, res: Response, next: NextFunction) {
    try {

        const requiredKeys = ['cod_postal', "descripcion", "provincia"];

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
        const localidad = await repository.findOne({ id });
        if (!localidad) {
            return res.status(404).send({ message: "Localidad no encontrada." });
        }
        return res.json({ data: localidad });
    } catch (error) {
        console.error("Error en findOne:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function add(req: Request, res: Response) {
    try {
        const input = req.body.sanitizedInput;

        const localidadInput = new Localidad(
            input.cod_postal,
            input.descripcion,
            input.provincia
        );
        const localidad = await repository.add(localidadInput);
        res.status(201).send({ message: 'Localidad agregada con éxito.', data: localidad });
    } catch (error) {
        console.error("Error en add:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function update(req: Request, res: Response) {
    try {
        const localidadId = req.params.id;
        const updatedData = req.body.sanitizedInput;

        // Verificar si la localidad existe antes de intentar actualizarla
        const localidadExiste = await repository.findOne({ id: localidadId });

        if (!localidadExiste) {
            const objectIdLocalidadId = new ObjectId(localidadId);
            const localidadInput = new Localidad(
                updatedData.cod_postal,
                updatedData.descripcion,
                updatedData.provincia,
                objectIdLocalidadId
            );

            const nuevoLocalidad = await repository.add(localidadInput);

            if (!nuevoLocalidad) {
                return res.status(500).send({ message: "Error al crear la nueva localidad." });
            }

            return res.status(201).send({ message: 'Localidad creada con éxito.', data: nuevoLocalidad });
        }

        // Si la localidad existe, la actualiza
        const updatedLocalidad = await repository.update(localidadId, updatedData);

        if (!updatedLocalidad) {
            return res.status(500).send({ message: "Error al actualizar la localidad." });
        }

        return res.status(200).send({ message: 'Localidad actualizada con éxito.', data: updatedLocalidad });

    } catch (error) {
        console.error("Error en update:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const localidad = await repository.delete({ id });
        if (!localidad) {
            res.status(404).send({ message: "Localidad no encontrada." });
        }
        res.status(204).send({ message: 'Localidad eliminada con éxito.' });
    } catch (error) {
        console.error("Error en remove:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

// OTROS MÉTODOS

async function getLocalidadesByProvincia(req: Request, res: Response) {
    try {
        const provinciaId = req.body.provincia;

        if (!provinciaId) {
            return res.status(400).send({ message: "ID de provincia es requerido en el cuerpo de la solicitud." });
        }

        const localidades = await repository.getLocalidadesByProvincia(provinciaId);

        res.json({ data: localidades });
    } catch (error) {
        console.error("Error en getLocalidadesByProvincia:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

export { sanitizeInput, findAll, findOne, add, update, remove, getLocalidadesByProvincia };
