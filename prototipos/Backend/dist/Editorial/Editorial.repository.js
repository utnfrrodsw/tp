import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';
const editoriales = db.collection('editoriales');
export class EditorialRepository {
    async findAll() {
        try {
            return await editoriales.find().toArray();
        }
        catch (error) {
            console.error("Error en findAll:", error);
            return undefined;
        }
    }
    async findOne(item) {
        try {
            const _id = new ObjectId(item.id);
            return (await editoriales.findOne({ _id })) || undefined;
        }
        catch (error) {
            console.error("Error en findOne:", error);
            return undefined;
        }
    }
    async add(item) {
        try {
            const result = await editoriales.insertOne(item);
            item._id = result.insertedId;
            return item;
        }
        catch (error) {
            console.error("Error en add:", error);
            return undefined;
        }
    }
    async update(id, item) {
        const _id = new ObjectId(id);
        try {
            const result = await editoriales.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' });
            return result || undefined;
        }
        catch (error) {
            console.error("Error en update:", error);
            return undefined;
        }
    }
    async delete(item) {
        const _id = new ObjectId(item.id);
        try {
            const result = await editoriales.findOneAndDelete({ _id });
            return result || undefined;
        }
        catch (error) {
            console.error("Error en delete:", error);
            return undefined;
        }
    }
    async findOneByDescripcion(item) {
        try {
            const editorial = await editoriales.findOne({ descripcion: item.descripcion });
            console.log(editorial);
            return editorial || undefined;
        }
        catch (error) {
            console.error("Error en findOneByDescripcion:", error);
            throw error;
        }
    }
}
//# sourceMappingURL=Editorial.repository.js.map