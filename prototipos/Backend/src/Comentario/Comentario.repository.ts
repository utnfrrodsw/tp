import { Repository } from "../Shared/repository.js";
import { Comentario } from "./Comentario.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb'

const comentarios = db.collection<Comentario>('Comentarios')

export class ComentarioRepository implements Repository<Comentario>{

    public async findAll(): Promise<Comentario[] | undefined> {
        try {
            return await comentarios.find().toArray()
        } catch (error) {
            console.error("Error en findAll:", error);
            throw error;
        }
    }

    public async findOne(item: { id: string; }): Promise<Comentario | undefined> {
        try {
            const _id = new ObjectId(item.id)
            return (await comentarios.findOne({ _id })) || undefined
        } catch (error) {
            console.error("Error en findOne:", error);
            throw error;
        }
    }

    public async add(item: Comentario): Promise<Comentario | undefined> {
        try {
            item._id = (await comentarios.insertOne(item)).insertedId
            return item
        } catch (error) {
            console.error("Error en add:", error);
            throw error;
        }
    }

    public async update(id: string, item: Comentario): Promise<Comentario | undefined> {
        try {
            const _id = new ObjectId(id)
            return (await comentarios.findOneAndUpdate({ _id }, { $set: item },
                { returnDocument: 'after' })) || undefined
        } catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }

    public async delete(item: { id: string; }): Promise<Comentario | undefined> {
        try {
            const _id = new ObjectId(item.id)
            return (await comentarios.findOneAndDelete({ _id })) || undefined
        } catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }

    public async findByUsuario(usuarioId: string): Promise<Comentario[] | undefined> {
        try {
            const todosLosComentarios = await comentarios.find().toArray();

            const comentariosFiltrados = todosLosComentarios.filter(comentario =>
                comentario.usuario.toString() === usuarioId
            );

            return comentariosFiltrados;
        } catch (error) {
            console.error("Error en findByUsuario:", error);
            throw error;
        }
    }

}
