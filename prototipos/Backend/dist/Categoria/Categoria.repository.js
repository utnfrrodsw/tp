import { Categoria } from "./Categoria.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';
const categoriasArray = [
    new Categoria("1", "Terror")
];
const categorias = db.collection('categorias');
export class CategoriaRepository {
    async findAll() {
        return await categorias.find().toArray();
    }
    async findOne(item) {
        const _id = new ObjectId(item.id);
        return (await categorias.findOne({ _id })) || undefined;
    }
    async add(item) {
        item._id = (await categorias.insertOne(item)).insertedId;
        return item;
    }
    async update(id, item) {
        const _id = new ObjectId(id);
        return (await categorias.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
    }
    async delete(item) {
        const _id = new ObjectId(item.id);
        return (await categorias.findOneAndDelete({ _id })) || undefined;
    }
}
//# sourceMappingURL=Categoria.repository.js.map