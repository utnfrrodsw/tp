import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';
const editoriales = db.collection('editoriales');
export class EditorialRepository {
    async findAll() {
        return await editoriales.find().toArray();
    }
    async findOne(item) {
        const _id = new ObjectId(item.id);
        return (await editoriales.findOne({ _id })) || undefined;
        //return await editorialesArray.find((editorial)=> editorial.id === item.id)
    }
    async add(item) {
        item._id = (await editoriales.insertOne(item)).insertedId;
        return item;
        //return await item
    }
    async update(id, item) {
        const _id = new ObjectId(id);
        return (await editoriales.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
    }
    async delete(item) {
        const _id = new ObjectId(item.id);
        return (await editoriales.findOneAndDelete({ _id })) || undefined;
    }
}
//# sourceMappingURL=Editorial.repository.js.map