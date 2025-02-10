import { Repository } from "../Shared/repository.js";
import { Resenia } from "./Resenia.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb'

const resenias = db.collection<Resenia>('resenias')

export class ReseniaRepository implements Repository<Resenia> {

    public async findAll(): Promise<Resenia[] | undefined> {
        try {
            return await resenias.find().toArray()
        } catch (error) {
            console.error("Error en findAll:", error);
            throw error;
        }
    }

    public async findOne(item: { id: string; }): Promise<Resenia | undefined> {
        try {
            const _id = new ObjectId(item.id)
            return (await resenias.findOne({ _id })) || undefined
        } catch (error) {
            console.error("Error en findOne:", error);
            throw error;
        }
    }

    public async add(item: Resenia): Promise<Resenia | undefined> {
        try {
            item._id = (await resenias.insertOne(item)).insertedId
            return item
        } catch (error) {
            console.error("Error en add:", error);
            throw error;
        }
    }

    public async update(id: string, item: Resenia): Promise<Resenia | undefined> {
        try {
            const _id = new ObjectId(id)
            return (await resenias.findOneAndUpdate({ _id }, { $set: item },
                { returnDocument: 'after' })) || undefined
        } catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }

    public async delete(item: { id: string; }): Promise<Resenia | undefined> {
        try {
            const _id = new ObjectId(item.id)
            return (await resenias.findOneAndDelete({ _id })) || undefined
        } catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }

    public async findByUsuario(usuarioId: string): Promise<Resenia[] | undefined> {
        try {
            const todasLasResenias = await resenias.find().toArray();

            const reseniasFiltradas = todasLasResenias.filter(resenia =>
                resenia.usuario.toString() === usuarioId
            );

            return reseniasFiltradas;
        } catch (error) {
            console.error("Error en findByUsuario:", error);
            throw error;
        }
    }

    public async findByLibro(libroId: string): Promise<Resenia[] | undefined> {
        try {
            const todasLasResenias = await resenias.find().toArray();

            const reseniasFiltradas = todasLasResenias.filter(resenia =>
                resenia.libro.toString() === libroId
            );

            return reseniasFiltradas;
        } catch (error) {
            console.error("Error en findByLibro:", error);
            throw error;
        }
    }

}
