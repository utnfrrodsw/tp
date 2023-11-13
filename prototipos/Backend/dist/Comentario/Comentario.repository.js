import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';
const comentarios = db.collection('Comentarios');
export class ComentarioRepository {
    async findAll() {
        try {
            return await comentarios.find().toArray();
        }
        catch (error) {
            console.error("Error en findAll:", error);
            throw error;
        }
    }
    async findOne(item) {
        try {
            const _id = new ObjectId(item.id);
            return (await comentarios.findOne({ _id })) || undefined;
        }
        catch (error) {
            console.error("Error en findOne:", error);
            throw error;
        }
    }
    async add(item) {
        try {
            item._id = (await comentarios.insertOne(item)).insertedId;
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
            return (await comentarios.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
        }
        catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }
    async delete(item) {
        try {
            const _id = new ObjectId(item.id);
            return (await comentarios.findOneAndDelete({ _id })) || undefined;
        }
        catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }
    async findByUsuario(usuarioId) {
        try {
            const todosLosComentarios = await comentarios.find().toArray();
            const comentariosFiltrados = todosLosComentarios.filter(comentario => comentario.usuario.toString() === usuarioId);
            return comentariosFiltrados;
        }
        catch (error) {
            console.error("Error en findByUsuario:", error);
            throw error;
        }
    }
}
//# sourceMappingURL=Comentario.repository.js.map