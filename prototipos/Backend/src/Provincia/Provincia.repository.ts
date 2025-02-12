import { Repository } from "../Shared/repository.js";
import { Provincia } from "./Provincia.entity.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';

const provincias = db.collection<Provincia>('provincias');

export class ProvinciaRepository implements Repository<Provincia> {

    public async findAll(): Promise<Provincia[] | undefined> {
        try {
            return await provincias.find().toArray()
        } catch (error) {
            console.error("Error en findAll:", error);
            throw error;
        }
    }

    public async findOne(item: { id: string; }): Promise<Provincia | undefined> {
        try {
            const _id = new ObjectId(item.id)
            return (await provincias.findOne({ _id })) || undefined
        } catch (error) {
            console.error("Error en findOne:", error);
            throw error;
        }
    }

    public async add(item: Provincia): Promise<Provincia | undefined> {
        try {
            item._id = (await provincias.insertOne(item)).insertedId
            return item
        } catch (error) {
            console.error("Error en add:", error);
            throw error;
        }
    }

    public async update(id: string, item: Provincia): Promise<Provincia | undefined> {
        try {
            const _id = new ObjectId(id)
            return (await provincias.findOneAndUpdate({ _id }, { $set: item },
                { returnDocument: 'after' })) || undefined
        } catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }

    public async delete(item: { id: string; }): Promise<Provincia | undefined> {
        try {
            const _id = new ObjectId(item.id)
            return (await provincias.findOneAndDelete({ _id })) || undefined
        } catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }

    public async findOneByDescripcion(descripcion: string): Promise<Provincia | undefined> {
        try {
            return (await provincias.findOne({ descripcion })) || undefined;
        } catch (error) {
            console.error("Error en findOneByDescripcion:", error);
            throw error;
        }
    }
}