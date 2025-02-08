import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';
const reseñas = db.collection('Reseñas');
export class ReseñaRepository {
    async findAll() {
        try {
            return await reseñas.find().toArray();
        }
        catch (error) {
            console.error("Error en findAll:", error);
            throw error;
        }
    }
    async findOne(item) {
        try {
            const _id = new ObjectId(item.id);
            return (await reseñas.findOne({ _id })) || undefined;
        }
        catch (error) {
            console.error("Error en findOne:", error);
            throw error;
        }
    }
    async add(item) {
        try {
            item._id = (await reseñas.insertOne(item)).insertedId;
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
            return (await reseñas.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
        }
        catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }
    async delete(item) {
        try {
            const _id = new ObjectId(item.id);
            return (await reseñas.findOneAndDelete({ _id })) || undefined;
        }
        catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }
    async findByUsuario(usuarioId) {
        try {
            const todasLasReseñas = await reseñas.find().toArray();
            const reseñasFiltradas = todasLasReseñas.filter(reseña => reseña.usuario.toString() === usuarioId);
            return reseñasFiltradas;
        }
        catch (error) {
            console.error("Error en findByUsuario:", error);
            throw error;
        }
    }
    async findByLibro(libroId) {
        try {
            const todasLasReseñas = await reseñas.find().toArray();
            const reseñasFiltradas = todasLasReseñas.filter(reseña => reseña.libro.toString() === libroId);
            return reseñasFiltradas;
        }
        catch (error) {
            console.error("Error en findByLibro:", error);
            throw error;
        }
    }
}
//# sourceMappingURL=Rese%C3%B1a.repository.js.map