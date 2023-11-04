import { AutorRepository } from "./Autor.repository.js";
import { Autor } from "./Autor.js";

const repository = new AutorRepository();

async function sanitizeInput(req, res, next) {
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        id: req.body.id,
    };

    // Elimina las claves no definidas
    Object.keys(req.body.sanitizedInput).forEach(key => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });

    next();

}

// Encuentra todos los autores
async function findAll(req, res) {
    try {
        const data = await repository.findAll();
        res.json({ data });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

// Encuentra un autor por su id
async function findOne(req, res) {
    const id = req.params.id;
    try {
        const autor = await repository.findOne({ id });
        if (!autor) {
            return res.status(404).send({ message: "Autor no encontrado." });
        }
        return res.json({ data: autor });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

// Añade un nuevo autor
async function add(req, res) {
    //console.log(req.body.sanitizedInput)
    try {
        const input = req.body.sanitizedInput;
        const autorInput = new Autor(input.nombre, input.apellido, input.id);
        const autor = await repository.add(autorInput);
        res.status(201).send({ message: 'Autor agregado con éxito.', data: autor });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

// Actualiza un autor existente
async function update(req, res) {
    try {
        const autor = await repository.update(req.params.id, req.body.sanitizedInput);
        if (!autor) {
            return res.status(404).send({ message: "Autor no encontrado." });
        }
        return res.status(200).send({ message: 'Autor actualizado con éxito.', data: autor });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

// Elimina un autor
async function remove(req, res) {
    const id = req.params.id;
    try {
        const autor = await repository.delete({ id });
        if (!autor) {
            return res.status(404).send({ message: "Autor no encontrado." });
        }
        return res.status(204).send({ message: 'Autor eliminado con éxito.' });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}


export { sanitizeInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=Autor.controler.js.map