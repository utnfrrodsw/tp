import { UsuarioRepository } from "./Usuario.repository.js";
import { Usuario } from "./Usuario.js";
import { ObjectId } from "mongodb";
const repository = new UsuarioRepository();
async function sanitizeInput(req, res, next) {
    try {
        const requiredKeys = ['nombre', 'apellido', 'email', 'direccion', 'localidad', 'avatar', 'tipo'];
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
        res.json({ data: await repository.findAll() });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function findOne(req, res) {
    try {
        const id = req.params.id;
        const usuario = await repository.findOne({ id });
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }
        return res.json({ data: usuario });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function add(req, res) {
    try {
        const input = req.body.sanitizedInput;
        const usuarioInput = new Usuario(input.nombre, input.apellido, input.email, input.direccion, new ObjectId(input.localidad), input.avatar, input.tipo);
        const usuario = await repository.add(usuarioInput);
        res.status(201).send({ message: 'Usuario agregado con éxito.', data: usuario });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function update(req, res) {
    try {
        const usuarioId = req.params.id;
        const updatedData = req.body.sanitizedInput;
        // Verificar si el usuario existe antes de intentar actualizarlo
        const usuarioExiste = await repository.findOne({ id: usuarioId });
        if (!usuarioExiste) {
            const objectIdUsuarioId = new ObjectId(usuarioId);
            const usuarioInput = new Usuario(updatedData.nombre, updatedData.apellido, updatedData.email, updatedData.direccion, updatedData.localidad, updatedData.avatar, updatedData.tipo, objectIdUsuarioId);
            const nuevoUsuario = await repository.add(usuarioInput);
            if (!nuevoUsuario) {
                return res.status(500).send({ message: "Error al crear el nuevo usuario." });
            }
            return res.status(201).send({ message: 'Usuario creado con éxito.', data: nuevoUsuario });
        }
        // Si el usuario existe, lo actualiza
        const updatedUsuario = await repository.update(usuarioId, updatedData);
        if (!updatedUsuario) {
            return res.status(500).send({ message: "Error al actualizar el usuario." });
        }
        return res.status(200).send({ message: 'Usuario actualizado con éxito.', data: updatedUsuario });
    }
    catch (error) {
        console.error("Error en update:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function remove(req, res) {
    try {
        const id = req.params.id;
        const usuario = await repository.delete({ id });
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }
        res.status(204).send({ message: 'Usuario eliminado con éxito.' });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
export { sanitizeInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=Usuario.controller.js.map