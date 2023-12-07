import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';
const localidades = db.collection('localidades');
export class LocalidadRepository {
    async findAll() {
        try {
            return await localidades.find().toArray();
        }
        catch (error) {
            console.error("Error en findAll:", error);
            throw error;
        }
    }
    async findOne(item) {
        try {
            const _id = new ObjectId(item.id);
            return (await localidades.findOne({ _id })) || undefined;
        }
        catch (error) {
            console.error("Error en findOne:", error);
            throw error;
        }
    }
    async add(item) {
        try {
            item._id = (await localidades.insertOne(item)).insertedId;
            return item;
        }
        catch (error) {
            console.error("Error en add:", error);
            throw error;
        }
    }
    async update(id, item) {
        try {
            const _id = new ObjectId(id);
            return (await localidades.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
        }
        catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }
    async delete(item) {
        try {
            const _id = new ObjectId(item.id);
            return (await localidades.findOneAndDelete({ _id })) || undefined;
        }
        catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }
    async getLocalidadesByProvincia(provinciaId) {
        try {
            const localidadesEnProvincia = await localidades.find({ provincia: new ObjectId(provinciaId) }).toArray();
            return localidadesEnProvincia;
        }
        catch (error) {
            console.error("Error en getLocalidadesByProvincia:", error);
            throw error;
        }
    }
}
//# sourceMappingURL=Localidad.repository.js.map