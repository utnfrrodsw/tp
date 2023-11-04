import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';

const libros = db.collection('libros');

export class LibroRepository {

    async findAll() {
        try {
            return await libros.find().toArray();
        } catch (error) {
            console.error("Error en findAll:", error);
            throw error;
        }
    }

    async findOne(item) {
        try {
            const _id = new ObjectId(item.id);
            return await libros.findOne({ _id }) || undefined;
        } catch (error) {
            console.error("Error en findOne:", error);
            throw error;
        }
    }

    async add(item) {
        try {
            const result = await libros.insertOne(item);
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
            return (await libros.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
        } catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }

    async delete(item) {
        try {
            const _id = new ObjectId(item.id);
            return (await libros.findOneAndDelete({ _id })) || undefined;
        } catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }
}

//# sourceMappingURL=Libro.repository.js.map