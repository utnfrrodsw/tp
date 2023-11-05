import { Localidad } from "./Localidad.entity.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';
const localidadesArray = [
    new Localidad("2000", "Rosario", new ObjectId("615a04308f47a056acc31e3c")),
    new Localidad("3000", "Santa Fe", new ObjectId("615a04308f47a056acc31e3d")),
    new Localidad("5000", "Venado Tuerto", new ObjectId("615a04308f47a056acc31e3e"))
];
const localidades = db.collection('localidades');
export class LocalidadRepository {
    async findAll() {
        return await localidades.find().toArray();
    }
    async findOne(item) {
        const _id = new ObjectId(item.id);
        return (await localidades.findOne({ _id })) || undefined;
    }
    async add(item) {
        item._id = (await localidades.insertOne(item)).insertedId;
        return item;
    }
    async update(id, item) {
        const _id = new ObjectId(id);
        return (await localidades.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
    }
    async delete(item) {
        const _id = new ObjectId(item.id);
        return (await localidades.findOneAndDelete({ _id })) || undefined;
    }
}
//# sourceMappingURL=Localidad.repository.js.map