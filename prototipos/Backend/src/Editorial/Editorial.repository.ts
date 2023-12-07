import { Repository } from "../Shared/repository.js";
import { Editorial } from "./Editorial.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb'

const editoriales = db.collection<Editorial>('editoriales')

export class EditorialRepository implements Repository<Editorial>{

    public async findAll(): Promise<Editorial[] | undefined> {
        try {
            return await editoriales.find().toArray()
        } catch (error) {
            console.error("Error en findAll:", error);
            return undefined;
        }
    }

    public async findOne(item: { id: string }): Promise<Editorial | undefined> {
        try {
            const _id = new ObjectId(item.id);
            return (await editoriales.findOne({ _id })) || undefined;
        } catch (error) {
            console.error("Error en findOne:", error);
            return undefined;
        }
    }

    public async add(item: Editorial): Promise<Editorial | undefined> {
        try {
            const result = await editoriales.insertOne(item);
            item._id = result.insertedId;
            return item;
        } catch (error) {
            console.error("Error en add:", error);
            return undefined;
        }
    }

    public async update(id: string, item: Editorial): Promise<Editorial | undefined> {
        const _id = new ObjectId(id);
        try {
            const result = await editoriales.findOneAndUpdate({ _id }, { $set: item },
                { returnDocument: 'after' });
            return result || undefined;
        } catch (error) {
            console.error("Error en update:", error);
            return undefined;
        }
    }

    public async delete(item: { id: string; }): Promise<Editorial | undefined> {
        const _id = new ObjectId(item.id);
        try {
            const result = await editoriales.findOneAndDelete({ _id });
            return result || undefined;
        } catch (error) {
            console.error("Error en delete:", error);
            return undefined;
        }
    }

    public async findOneByDescripcion(item: { descripcion: string }): Promise<Editorial | undefined> {
        try {
            const editorial = await editoriales.findOne({ descripcion: item.descripcion });
            console.log(editorial);
            return editorial || undefined;
        } catch (error) {
            console.error("Error en findOneByDescripcion:", error);
            throw error;
        }
    }
}