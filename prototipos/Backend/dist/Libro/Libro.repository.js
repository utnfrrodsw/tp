import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';
const libros = db.collection('libros');
export class LibroRepository {
    async findAll() {
        return await libros.find().toArray();
    }
    async findOne(item) {
        const _id = new ObjectId(item.id);
        return (await libros.findOne({ _id })) || undefined;
    }
    async add(item) {
        item._id = (await libros.insertOne(item)).insertedId;
        return item;
    }
    async update(id, item) {
        const _id = new ObjectId(id);
        return (await libros.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
    }
    async delete(item) {
        const _id = new ObjectId(item.id);
        return (await libros.findOneAndDelete({ _id })) || undefined;
    }
}
//# sourceMappingURL=Libro.repository.js.map