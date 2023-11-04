import { Usuario } from "./Usuario.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';

const usuariosArray = [
    new Usuario("1", "Jhon", "Smith", "jhonsmt@gmail.com", "Calle falsa 123", "Springfield", "", "usuario")
];

const usuarios = db.collection('usuarios');

export class UsuarioRepository {

    async findAll() {
        try {
            return await usuarios.find().toArray();
        } catch (error) {
            console.error("Error en findAll:", error);
            throw error;
        }
    }

    async findOne(item) {
        try {
            const _id = new ObjectId(item.id);
            return await usuarios.findOne({ _id }) || undefined;
        } catch (error) {
            console.error("Error en findOne:", error);
            throw error;
        }
    }

    async add(item) {
        try {
            const result = await usuarios.insertOne(item);
            item._id = result.insertedId;
            return item;
        } catch (error) {
            console.error("Error en add:", error);
            throw error;
        }
    }

    async update(id, item) {
        try {
            const _id = new ObjectId(id);
            return (await usuarios.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
        } catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }

    async delete(item) {
        try {
            const _id = new ObjectId(item.id);
            return (await usuarios.findOneAndDelete({ _id })) || undefined;
        } catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }
}

//# sourceMappingURL=Usuario.repository.js.map