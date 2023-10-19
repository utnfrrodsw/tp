import { Repository } from "../Shared/repository.js";
import { Autor } from "./Autor.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb'

const autores = db.collection<Autor>('autores')

export class AutorRepository implements Repository<Autor>{

    public async findAll(): Promise <Autor[] | undefined> {
        return await autores.find().toArray()
    }

    public async findOne(item: { id: string; }): Promise <Autor | undefined> {
        
        const _id = new ObjectId(item.id)
        return (await autores.findOne({ _id })) || undefined
        
        //return await editorialesArray.find((editorial)=> editorial.id === item.id)
    }

    public async add(item: Autor): Promise <Autor | undefined> {
        
        item._id= (await autores.insertOne(item)).insertedId
        return item

        //return await item
    }

    public async update(id:string,item: Autor): Promise <Autor | undefined> {
        const _id = new ObjectId(id)
        return (await autores.findOneAndUpdate({ _id }, { $set: item },
            { returnDocument: 'after' })) || undefined

    }

    public async delete(item: { id: string; }): Promise< Autor | undefined> {
        const _id = new ObjectId(item.id)
        return (await autores.findOneAndDelete({ _id })) || undefined          
        }
    
    }
    

