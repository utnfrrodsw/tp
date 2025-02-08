import { Repository } from "../Shared/repository.js";
import { Reseña } from "./Reseña.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb'

const reseñas = db.collection<Reseña>('Reseñas')

export class ReseñaRepository implements Repository<Reseña>{

    public async findAll(): Promise<Reseña[] | undefined> {
        try {
            return await reseñas.find().toArray()
        } catch (error) {
            console.error("Error en findAll:", error);
            throw error;
        }
    }

    public async findOne(item: { id: string; }): Promise<Reseña | undefined> {
        try {
            const _id = new ObjectId(item.id)
            return (await reseñas.findOne({ _id })) || undefined
        } catch (error) {
            console.error("Error en findOne:", error);
            throw error;
        }
    }

    public async add(item: Reseña): Promise<Reseña | undefined> {
        try {
            item._id = (await reseñas.insertOne(item)).insertedId
            return item
        } catch (error) {
            console.error("Error en add:", error);
            throw error;
        }
    }

    public async update(id: string, item: Reseña): Promise<Reseña | undefined> {
        try {
            const _id = new ObjectId(id)
            return (await reseñas.findOneAndUpdate({ _id }, { $set: item },
                { returnDocument: 'after' })) || undefined
        } catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }

    public async delete(item: { id: string; }): Promise<Reseña | undefined> {
        try {
            const _id = new ObjectId(item.id)
            return (await reseñas.findOneAndDelete({ _id })) || undefined
        } catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }

    public async findByUsuario(usuarioId: string): Promise<Reseña[] | undefined> {
        try {
            const todasLasReseñas = await reseñas.find().toArray();

            const reseñasFiltradas = todasLasReseñas.filter(reseña =>
                reseña.usuario.toString() === usuarioId
            );

            return reseñasFiltradas;
        } catch (error) {
            console.error("Error en findByUsuario:", error);
            throw error;
        }
    }

    public async findByLibro(libroId: string): Promise<Reseña[] | undefined> {
        try {
            const todasLasReseñas = await reseñas.find().toArray();

            const reseñasFiltradas = todasLasReseñas.filter(reseña =>
                reseña.libro.toString() === libroId
            );

            return reseñasFiltradas;
        } catch (error) {
            console.error("Error en findByLibro:", error);
            throw error;
        }
    }

}
