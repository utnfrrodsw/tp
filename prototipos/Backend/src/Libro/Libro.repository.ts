import { Repository } from "../Shared/repository.js";
import { Libro } from "./Libro.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb'

const libros = db.collection<Libro>('libros')

export class LibroRepository implements Repository<Libro>{

    public async findAll(): Promise <Libro[] | undefined> {
        return await libros.find().toArray()
    }

    public async findOne(item: { id: string; }): Promise <Libro | undefined> {
        
        const _id = new ObjectId(item.id)
        return (await libros.findOne({ _id })) || undefined
        
    }

    public async add(item: Libro): Promise <Libro | undefined> {
        
        item._id= (await libros.insertOne(item)).insertedId
        return item

    }

    public async update(id:string,item: Libro): Promise <Libro | undefined> {
        const _id = new ObjectId(id)
        return (await libros.findOneAndUpdate({ _id }, { $set: item },
            { returnDocument: 'after' })) || undefined

    }

    public async delete(item: { id: string; }): Promise< Libro | undefined> {
        const _id = new ObjectId(item.id)
        return (await libros.findOneAndDelete({ _id })) || undefined          
        }
    
    }
    

