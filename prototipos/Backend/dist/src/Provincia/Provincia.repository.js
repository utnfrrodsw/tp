import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';
const provincias = db.collection('provincias');
export class ProvinciaRepository {
    async findAll() {
        try {
            return await provincias.find().toArray();
        }
        catch (error) {
            console.error("Error en findAll:", error);
            throw error;
        }
    }
    async findOne(item) {
        try {
            const _id = new ObjectId(item.id);
            return (await provincias.findOne({ _id })) || undefined;
        }
        catch (error) {
            console.error("Error en findOne:", error);
            throw error;
        }
    }
    async add(item) {
        try {
            item._id = (await provincias.insertOne(item)).insertedId;
            return item;
        }
        catch (error) {
            console.error("Error en add:", error);
            throw error;
        }
    }
    async update(id, item) {
        try {
            const _id = new ObjectId(id);
            return (await provincias.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
        }
        catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }
    async delete(item) {
        try {
            const _id = new ObjectId(item.id);
            return (await provincias.findOneAndDelete({ _id })) || undefined;
        }
        catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }
    async findOneByDescripcion(descripcion) {
        try {
            return (await provincias.findOne({ descripcion })) || undefined;
        }
        catch (error) {
            console.error("Error en findOneByDescripcion:", error);
            throw error;
        }
    }
}
//# sourceMappingURL=Provincia.repository.js.map