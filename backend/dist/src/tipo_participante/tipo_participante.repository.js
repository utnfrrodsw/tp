import { db } from '../shared/db/conn.js';
import { ObjectId } from 'mongodb';
const tipos_participantes = db.collection('Tipos_participantes');
export class tipo_participanteRepository {
    async findAll() {
        return await tipos_participantes.find().toArray();
    }
    async findOne(item) {
        const _id = new ObjectId(item.id);
        return (await tipos_participantes.findOne({ _id })) || undefined;
    }
    async add(item) {
        item._id = (await tipos_participantes.insertOne(item)).insertedId;
        return item;
    }
    async update(item) {
        const { id, ...tipos_parInput } = item;
        const _id = new ObjectId(id);
        return (await tipos_participantes.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
    }
    async delete(item) {
        const _id = new ObjectId(item.id);
        return (await tipos_participantes.findOneAndDelete({ _id })) || undefined;
    }
}
//# sourceMappingURL=tipo_participante.repository.js.map