import { Repository } from "../Shared/repository.js";
import { Provincia } from "./Provincia.entity.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb';

const provinciasArray = [
    new Provincia(
        "1",
        "Buenos Aires",
        new ObjectId()
    ),
    new Provincia(
        "2",
        "Córdoba",
        new ObjectId()
    ),
    new Provincia(
        "3",
        "Santa Fe",
        new ObjectId()
    )
];

const provincias = db.collection<Provincia>('provincias');

export class ProvinciaRepository implements Repository<Provincia> {

    public async findAll(): Promise<Provincia[] | undefined> {
        return await provincias.find().toArray();
    }

    public async findOne(item: { id: string; }): Promise<Provincia | undefined> {
        const _id = new ObjectId(item.id);
        return (await provincias.findOne({ _id })) || undefined;
    }

    public async add(item: Provincia): Promise<Provincia | undefined> {
        item._id = (await provincias.insertOne(item)).insertedId;
        return item;
    }

    public async update(id: string, item: Provincia): Promise<Provincia | undefined> {
        const _id = new ObjectId(id);
        return (await provincias.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
    }

    public async delete(item: { id: string; }): Promise<Provincia | undefined> {
        const _id = new ObjectId(item.id);
        return (await provincias.findOneAndDelete({ _id })) || undefined;
    }
}
