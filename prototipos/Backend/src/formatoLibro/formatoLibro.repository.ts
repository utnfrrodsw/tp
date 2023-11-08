import { Repository } from "../Shared/repository.js";
import { formatoLibro } from "./formatoLibro.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb'

const formatos = db.collection<formatoLibro>('formatos')

export class formatoLibroRepository implements Repository<formatoLibro>{

    public async findAll(): Promise<formatoLibro[] | undefined> {
        try {
            return await formatos.find().toArray();
        } catch (error) {
            console.error("Error en findAll:", error);
            return undefined;
        }
    }

    public async findOne(item: { id: string }): Promise<formatoLibro | undefined> {
        try {
            const _id = new ObjectId(item.id);
            return (await formatos.findOne({ _id })) || undefined;
        } catch (error) {
            console.error("Error en findOne:", error);
            return undefined;
        }
    }

    public async add(item: formatoLibro): Promise<formatoLibro | undefined> {
        try {
            item._id = (await formatos.insertOne(item)).insertedId;
            return item;
        } catch (error) {
            console.error("Error en add:", error);
            return undefined;
        }
    }

    public async update(id: string, item: formatoLibro): Promise<formatoLibro | undefined> {
        try {
            const _id = new ObjectId(id);
            return (await formatos.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
        } catch (error) {
            console.error("Error en update:", error);
            return undefined;
        }
    }

    public async delete(item: { id: string }): Promise<formatoLibro | undefined> {
        try {
            const _id = new ObjectId(item.id);
            return (await formatos.findOneAndDelete({ _id })) || undefined;
        } catch (error) {
            console.error("Error en delete:", error);
            return undefined;
        }
    }
}