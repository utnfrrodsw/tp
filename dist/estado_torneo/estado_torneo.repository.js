import { db } from '../shared/db/conn.js';
import { ObjectId } from 'mongodb';
const estados_torneos = db.collection('Estados_torneos');
export class estado_torneoRepository {
    async findAll() {
        return await estados_torneos.find().toArray();
    }
    async findOne(item) {
        const _id = new ObjectId(item.id);
        return (await estados_torneos.findOne({ _id })) || undefined;
    }
    async add(item) {
        item._id = (await estados_torneos.insertOne(item)).insertedId;
        return item;
    }
    async update(item) {
        const { id, ...estado_torneoInput } = item;
        const _id = new ObjectId(id);
        return (await estados_torneos.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
    }
    async delete(item) {
        const _id = new ObjectId(item.id);
        return (await estados_torneos.findOneAndDelete({ _id })) || undefined;
    }
}
//# sourceMappingURL=estado_torneo.repository.js.map