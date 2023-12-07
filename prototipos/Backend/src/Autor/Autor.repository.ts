import { Repository } from "../Shared/repository.js";
import { Autor } from "./Autor.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb'

const autores = db.collection<Autor>('autores')

export class AutorRepository implements Repository<Autor>{

    public async findAll(): Promise<Autor[] | undefined> {
        try {
            return await autores.find().toArray();
        } catch (error) {
            console.error("Error en findAll:", error);
            throw error;
        }
    }

    public async findOne(item: { id: string }): Promise<Autor | undefined> {
        try {
            const _id = new ObjectId(item.id);
            return (await autores.findOne({ _id })) || undefined;
        } catch (error) {
            console.error("Error en findOne:", error);
            throw error;
        }
    }

    public async add(item: Autor): Promise<Autor | undefined> {
        try {
            item._id = (await autores.insertOne(item)).insertedId;
            return item;
        } catch (error) {
            console.error("Error en add:", error);
            throw error;
        }
    }

    public async update(id: string, item: Autor): Promise<Autor | undefined> {
        try {
            const _id = new ObjectId(id);
            return (await autores.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
        } catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }

    public async delete(item: { id: string }): Promise<Autor | undefined> {
        try {
            const _id = new ObjectId(item.id);
            return (await autores.findOneAndDelete({ _id })) || undefined;
        } catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }

    public async findOneByNombreCompleto(item: { nombreCompleto: string }): Promise<Autor | undefined> {
        try {
            const autor = await autores.findOne({ nombreCompleto: item.nombreCompleto });
            console.log(autor);
            return autor || undefined;
        } catch (error) {
            console.error("Error en findOneByNombreCompleto:", error);
            throw error;
        }
    }
}
