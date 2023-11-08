import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';
const formatos = db.collection('formatos');
export class formatoLibroRepository {
    async findAll() {
        try {
            return await formatos.find().toArray();
        }
        catch (error) {
            console.error("Error en findAll:", error);
            return undefined;
        }
    }
    async findOne(item) {
        try {
            const _id = new ObjectId(item.id);
            return (await formatos.findOne({ _id })) || undefined;
        }
        catch (error) {
            console.error("Error en findOne:", error);
            return undefined;
        }
    }
    async add(item) {
        try {
            item._id = (await formatos.insertOne(item)).insertedId;
            return item;
        }
        catch (error) {
            console.error("Error en add:", error);
            return undefined;
        }
    }
    async update(id, item) {
        try {
            const _id = new ObjectId(id);
            return (await formatos.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
        }
        catch (error) {
            console.error("Error en update:", error);
            return undefined;
        }
    }
    async delete(item) {
        try {
            const _id = new ObjectId(item.id);
            return (await formatos.findOneAndDelete({ _id })) || undefined;
        }
        catch (error) {
            console.error("Error en delete:", error);
            return undefined;
        }
    }
}
//# sourceMappingURL=formatoLibro.repository.js.map