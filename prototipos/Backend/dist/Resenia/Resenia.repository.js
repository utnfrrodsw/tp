import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';
const resenias = db.collection('resenias');
export class ReseniaRepository {
    async findAll() {
        try {
            return await resenias.find().toArray();
        }
        catch (error) {
            console.error("Error en findAll:", error);
            throw error;
        }
    }
    async findOne(item) {
        try {
            const _id = new ObjectId(item.id);
            return (await resenias.findOne({ _id })) || undefined;
        }
        catch (error) {
            console.error("Error en findOne:", error);
            throw error;
        }
    }
    async add(item) {
        try {
            item._id = (await resenias.insertOne(item)).insertedId;
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
            return (await resenias.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
        }
        catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }
    async delete(item) {
        try {
            const _id = new ObjectId(item.id);
            return (await resenias.findOneAndDelete({ _id })) || undefined;
        }
        catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }
    async findByUsuario(usuarioId) {
        try {
            const todasLasResenias = await resenias.find().toArray();
            const reseniasFiltradas = todasLasResenias.filter(resenia => resenia.usuario.toString() === usuarioId);
            return reseniasFiltradas;
        }
        catch (error) {
            console.error("Error en findByUsuario:", error);
            throw error;
        }
    }
    async findByLibro(libroId) {
        try {
            const todasLasResenias = await resenias.find().toArray();
            const reseniasFiltradas = todasLasResenias.filter(resenia => resenia.libro.toString() === libroId);
            return reseniasFiltradas;
        }
        catch (error) {
            console.error("Error en findByLibro:", error);
            throw error;
        }
    }
}
//# sourceMappingURL=Resenia.repository.js.map