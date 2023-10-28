import { Repository } from "../Shared/repository.js";
import { Categoria } from "./Categoria.js";
import { db } from "../Shared/db/conn.mongo.js";
import { ObjectId } from 'mongodb'

const categoriasArray = [
    new Categoria(
        "1",
        "Terror"
    )

]

const categorias = db.collection<Categoria>('categorias')

export class CategoriaRepository implements Repository<Categoria>{

    public async findAll(): Promise <Categoria[] | undefined> {
        return await categorias.find().toArray()
    }

    public async findOne(item: { id: string; }): Promise <Categoria | undefined> {
        
        const _id = new ObjectId(item.id)
        return (await categorias.findOne({ _id })) || undefined
    }

    public async add(item: Categoria): Promise <Categoria | undefined> {
        item._id= (await categorias.insertOne(item)).insertedId
        return item
    }

    public async update(id:string,item: Categoria): Promise <Categoria | undefined> {
        const _id = new ObjectId(id)
        return (await categorias.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined

    }

    public async delete(item: { id: string; }): Promise <Categoria | undefined> {
        const _id = new ObjectId(item.id)
        return (await categorias.findOneAndDelete({ _id })) || undefined
    
    }
    

}