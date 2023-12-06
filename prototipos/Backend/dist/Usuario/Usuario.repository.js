import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';
const usuarios = db.collection('usuarios');
export class UsuarioRepositoryImpl {
    async findAll() {
        try {
            return await usuarios.find().toArray();
        }
        catch (error) {
            console.error("Error en findAll:", error);
            throw error;
        }
    }
    async findOne(item) {
        try {
            const result = await usuarios.findOne(item);
            return result ? result : undefined;
        }
        catch (error) {
            console.error("Error en findOne:", error);
            throw error;
        }
    }
    async findOneByEmail(item) {
        try {
            const usuario = await usuarios.findOne({ email: item.email });
            return usuario || undefined;
        }
        catch (error) {
            console.error("Error en findOneByEmail:", error);
            throw error;
        }
    }
    async add(item) {
        try {
            item._id = (await usuarios.insertOne(item)).insertedId;
            return item;
        }
        catch (error) {
            console.error("Error en add:", error);
            throw error;
        }
    }
    async update(id, item) {
        try {
            console.log('Entrando en update');
            const _id = id instanceof ObjectId ? id : new ObjectId(id);
            return (await usuarios.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
        }
        catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }
    async delete(item) {
        try {
            const _id = new ObjectId(item.id);
            return (await usuarios.findOneAndDelete({ _id })) || undefined;
        }
        catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }
    async getByUsername(username) {
        try {
            const usuario = await usuarios.findOne({ username });
            return usuario || undefined;
        }
        catch (error) {
            console.error("Error en getByUsername:", error);
            throw error;
        }
    }
    async getById(userId) {
        try {
            const usuario = await usuarios.findOne({ _id: new ObjectId(userId) });
            return usuario || undefined;
        }
        catch (error) {
            console.error("Error en getById:", error);
            throw error;
        }
    }
    async getByToken(token) {
        try {
            const usuario = await usuarios.findOne({ "tokens.token": token });
            return usuario || undefined;
        }
        catch (error) {
            console.error("Error en getByToken:", error);
            throw error;
        }
    }
    async updateAttribute(id, attribute, value) {
        try {
            console.log('Entrando en updateAttribute');
            const _id = id instanceof ObjectId ? id : new ObjectId(id);
            const updateQuery = {};
            updateQuery[attribute] = value;
            return (await usuarios.findOneAndUpdate({ _id }, { $set: updateQuery }, { returnDocument: 'after' })) || undefined;
        }
        catch (error) {
            console.error("Error en updateAttribute:", error);
            throw error;
        }
    }
}
//# sourceMappingURL=Usuario.repository.js.map