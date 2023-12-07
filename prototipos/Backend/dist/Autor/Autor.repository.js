import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';
const autores = db.collection('autores');
export class AutorRepository {
    async findAll() {
        try {
            return await autores.find().toArray();
        }
        catch (error) {
            console.error("Error en findAll:", error);
            throw error;
        }
    }
    async findOne(item) {
        try {
            const _id = new ObjectId(item.id);
            return (await autores.findOne({ _id })) || undefined;
        }
        catch (error) {
            console.error("Error en findOne:", error);
            throw error;
        }
    }
    async add(item) {
        try {
            item._id = (await autores.insertOne(item)).insertedId;
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
            return (await autores.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
        }
        catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }
    async delete(item) {
        try {
            const _id = new ObjectId(item.id);
            return (await autores.findOneAndDelete({ _id })) || undefined;
        }
        catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }
    async findOneByNombreCompleto(item) {
        try {
            const autor = await autores.findOne({ nombreCompleto: item.nombreCompleto });
            console.log(autor);
            return autor || undefined;
        }
        catch (error) {
            console.error("Error en findOneByNombreCompleto:", error);
            throw error;
        }
    }
}
//# sourceMappingURL=Autor.repository.js.map