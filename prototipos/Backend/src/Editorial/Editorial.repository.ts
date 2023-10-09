import { Repository } from "../Shared/repository.js";
import { Editorial } from "./Editorial.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb'

const editoriales = db.collection<Editorial>('editoriales')

export class EditorialRepository implements Repository<Editorial>{

    public async findAll(): Promise <Editorial[] | undefined> {
        return await editoriales.find().toArray()
    }

    public async findOne(item: { id: string; }): Promise <Editorial | undefined> {
        
        const _id = new ObjectId(item.id)
        return (await editoriales.findOne({ _id })) || undefined
        
        //return await editorialesArray.find((editorial)=> editorial.id === item.id)
    }

    public async add(item: Editorial): Promise <Editorial | undefined> {
        
        item._id= (await editoriales.insertOne(item)).insertedId
        return item

        //return await item
    }

    public async update(id:string,item: Editorial): Promise <Editorial | undefined> {
        const _id = new ObjectId(id)
        return (await editoriales.findOneAndUpdate({ _id }, { $set: item },
            { returnDocument: 'after' })) || undefined

    }

    public async delete(item: { id: string; }): Promise< Editorial | undefined> {
        const _id = new ObjectId(item.id)
        return (await editoriales.findOneAndDelete({ _id })) || undefined          
        }
    
    }
    

