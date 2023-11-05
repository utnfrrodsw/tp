import { Repository } from "../Shared/repository.js";
import { Localidad } from "./Localidad.entity.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';

const localidadesArray = [
    new Localidad("2000", "Rosario", new ObjectId("615a04308f47a056acc31e3c")), // Corregir ObjectId
    new Localidad("3000", "Santa Fe", new ObjectId("615a04308f47a056acc31e3d")),
    new Localidad("5000", "Venado Tuerto", new ObjectId("615a04308f47a056acc31e3e"))
];

const localidades = db.collection<Localidad>('localidades');

export class LocalidadRepository implements Repository<Localidad> {

    public async findAll(): Promise<Localidad[] | undefined> {
        return await localidades.find().toArray();
    }

    public async findOne(item: { id: string; }): Promise<Localidad | undefined> {
        const _id = new ObjectId(item.id);
        return (await localidades.findOne({ _id })) || undefined;
    }

    public async add(item: Localidad): Promise<Localidad | undefined> {
        item._id = (await localidades.insertOne(item)).insertedId;
        return item;
    }

    public async update(id: string, item: Localidad): Promise<Localidad | undefined> {
        const _id = new ObjectId(id);
        return (await localidades.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
    }

    public async delete(item: { id: string; }): Promise<Localidad | undefined> {
        const _id = new ObjectId(item.id);
        return (await localidades.findOneAndDelete({ _id })) || undefined;
    }
}
