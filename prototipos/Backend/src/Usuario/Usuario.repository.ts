import { Repository } from "../Shared/repository.js";
import { Usuario } from "./Usuario.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb'


const usuarios = db.collection<Usuario>('usuarios')

export class UsuarioRepository implements Repository<Usuario>{

    public async findAll(): Promise<Usuario[] | undefined> {
        try {
            return await usuarios.find().toArray()
        } catch (error) {
            console.error("Error en findAll:", error);
            throw error;
        }
    }

    public async findOne(item: { id: string; }): Promise<Usuario | undefined> {
        try {
            const _id = new ObjectId(item.id);
            const usuario = await usuarios.findOne({ _id });

            return usuario || undefined;
        } catch (error) {
            console.error("Error en findOne:", error);
            throw error;
        }
    }

    public async findOneByEmail(item: { email: string }): Promise<Usuario | undefined> {
        try {
            const usuario = await usuarios.findOne({ email: item.email });
            return usuario || undefined;
        } catch (error) {
            console.error("Error en findOneByEmail:", error);
            throw error;
        }
    }

    public async add(item: Usuario): Promise<Usuario | undefined> {
        try {
            item._id = (await usuarios.insertOne(item)).insertedId
            return item
        } catch (error) {
            console.error("Error en add:", error);
            throw error;
        }
    }

    public async update(id: string, item: Usuario): Promise<Usuario | undefined> {
        try {
            const _id = new ObjectId(id)
            return (await usuarios.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined
        } catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    }

    public async delete(item: { id: string; }): Promise<Usuario | undefined> {
        try {
            const _id = new ObjectId(item.id)
            return (await usuarios.findOneAndDelete({ _id })) || undefined
        } catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }

    async getByUsername(username: string): Promise<Usuario | undefined> {
        try {
            const usuario = await usuarios.findOne({ username });
            return usuario || undefined;
        } catch (error) {
            console.error("Error en getByUsername:", error);
            throw error;
        }
    }
}