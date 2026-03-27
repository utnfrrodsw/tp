import { Deporte } from './deporte.entity.js';
import { db } from '../shared/db/conn.js';
import { ObjectId } from 'mongodb';
const deportes = db.collection('deportes');
const Deportes = [
    new Deporte("Futbol", 20, ["Martes 15:30 a 16:30", "Jueves 16:00 a 17:00"], 2000, new ObjectId()),
];
export class DeporteRepository {
    async findAll() {
        return await deportes.find().toArray();
    }
    async findOne(item) {
        const _id = new ObjectId(item.id);
        return (await deportes.findOne({ _id })) || undefined;
    }
    async add(item) {
        item._id = (await deportes.insertOne(item)).insertedId;
        return item;
    }
    async update(id, item) {
        const _id = new ObjectId(id);
        return (await deportes.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
    }
    async delete(item) {
        const _id = new ObjectId(item.id);
        return (await deportes.findOneAndDelete({ _id })) || undefined;
    }
}
//# sourceMappingURL=deporte.repository.js.map