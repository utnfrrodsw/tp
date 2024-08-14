import { db } from '../shared/db/conn.js';
import { ObjectId } from 'mongodb';
const formatos_torneos = db.collection('Formatos_torneos');
export class Formatos_torneoRepository {
    async findAll() {
        return await formatos_torneos.find().toArray();
    }
    async findOne(item) {
        const _id = new ObjectId(item.id);
        return (await formatos_torneos.findOne({ _id })) || undefined;
    }
    async add(item) {
        item._id = (await formatos_torneos.insertOne(item)).insertedId;
        return item;
    }
    async update(item) {
        const { id, ...formatosInput } = item;
        const _id = new ObjectId(id);
        return (await formatos_torneos.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
    }
    async delete(item) {
        const _id = new ObjectId(item.id);
        return (await formatos_torneos.findOneAndDelete({ _id })) || undefined;
    }
}
//# sourceMappingURL=formatos_torneo.Repository.js.map