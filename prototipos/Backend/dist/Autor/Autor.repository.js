import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';
const autores = db.collection('autores');
export class AutorRepository {
    async findAll() {
        return await autores.find().toArray();
    }
    async findOne(item) {
        const _id = new ObjectId(item.id);
        return (await autores.findOne({ _id })) || undefined;
        //return await editorialesArray.find((editorial)=> editorial.id === item.id)
    }
    async add(item) {
        item._id = (await autores.insertOne(item)).insertedId;
        return item;
        //return await item
    }
    async update(id, item) {
        const _id = new ObjectId(id);
        return (await autores.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
    }
    async delete(item) {
        const _id = new ObjectId(item.id);
        return (await autores.findOneAndDelete({ _id })) || undefined;
    }
}
//# sourceMappingURL=Autor.repository.js.map