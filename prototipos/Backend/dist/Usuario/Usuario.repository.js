import { Usuario } from "./Usuario.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';
const usuariosArray = [
    new Usuario("1", "Jhon", "Smith", "jhonsmt@gmail.com", "calle falsa 123", "Springfield", "", "usuario")
];
const usuarios = db.collection('usuarios');
export class UsuarioRepository {
    async findAll() {
        return await usuarios.find().toArray();
    }
    async findOne(item) {
        const _id = new ObjectId(item.id);
        return (await usuarios.findOne({ _id })) || undefined;
    }
    async add(item) {
        item._id = (await usuarios.insertOne(item)).insertedId;
        return item;
    }
    async update(id, item) {
        const _id = new ObjectId(id);
        return (await usuarios.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
    }
    async delete(item) {
        const _id = new ObjectId(item.id);
        return (await usuarios.findOneAndDelete({ _id })) || undefined;
    }
}
//# sourceMappingURL=Usuario.repository.js.map