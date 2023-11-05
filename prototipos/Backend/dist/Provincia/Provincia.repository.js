import { Provincia } from "./Provincia.entity.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';
const provinciasArray = [
    new Provincia("1", "Buenos Aires", new ObjectId()),
    new Provincia("2", "Córdoba", new ObjectId()),
    new Provincia("3", "Santa Fe", new ObjectId())
];
const provincias = db.collection('provincias');
export class ProvinciaRepository {
    async findAll() {
        return await provincias.find().toArray();
    }
    async findOne(item) {
        const _id = new ObjectId(item.id);
        return (await provincias.findOne({ _id })) || undefined;
    }
    async add(item) {
        item._id = (await provincias.insertOne(item)).insertedId;
        return item;
    }
    async update(id, item) {
        const _id = new ObjectId(id);
        return (await provincias.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
    }
    async delete(item) {
        const _id = new ObjectId(item.id);
        return (await provincias.findOneAndDelete({ _id })) || undefined;
    }
}
//# sourceMappingURL=Provincia.repository.js.map