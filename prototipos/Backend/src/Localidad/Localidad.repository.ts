import { Repository } from "../Shared/repository.js";
import { Localidad } from "./Localidad.entity.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';

const localidades = db.collection<Localidad>('localidades');

export class LocalidadRepository implements Repository<Localidad> {

    public async findAll(): Promise<Localidad[] | undefined> {
        try {
            return await localidades.find().toArray()
        } catch (error) {
            console.error("Error en findAll:", error);
            throw error;
        }
    }

    public async findOne(item: { id: string; }): Promise<Localidad | undefined> {
        try {
            const _id = new ObjectId(item.id)
            return (await localidades.findOne({ _id })) || undefined
        } catch (error) {
            console.error("Error en findOne:", error);
            throw error;
        }
    }

    public async add(item: Localidad): Promise<Localidad | undefined> {
        try {
            item._id = (await localidades.insertOne(item)).insertedId
            return item
        } catch (error) {
            console.error("Error en add:", error);
            throw error;
        }
    }

    public async update(id: string, item: Localidad): Promise<Localidad | undefined> {
        try {
            const _id = new ObjectId(id)
            return (await localidades.findOneAndUpdate({ _id }, { $set: item },
                { returnDocument: 'after' })) || undefined
        } catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }

    public async delete(item: { id: string; }): Promise<Localidad | undefined> {
        try {
            const _id = new ObjectId(item.id)
            return (await localidades.findOneAndDelete({ _id })) || undefined
        } catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }

    public async getLocalidadesByProvincia(provinciaId: string): Promise<Localidad[] | undefined> {
        try {
            const localidadesEnProvincia = await localidades.find({ provincia: new ObjectId(provinciaId) }).toArray();
            return localidadesEnProvincia;
        } catch (error) {
            console.error("Error en getLocalidadesByProvincia:", error);
            throw error;
        }
    }
}
