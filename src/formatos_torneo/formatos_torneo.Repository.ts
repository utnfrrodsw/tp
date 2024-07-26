import { Repository } from "../shared/repository.js"
import { formatos_torneo } from "./formatos_torneo.entity.js"
import { db } from '../shared/db/conn.js'
import { ObjectId } from 'mongodb'

const formatos_torneos = db.collection<formatos_torneo>('Formatos_torneos')

export class Formatos_torneoRepository implements Repository<formatos_torneo> {
    public async findAll(): Promise<formatos_torneo[] | undefined> {
        return await formatos_torneos.find().toArray()
    }

    public async findOne(item: { id: string }): Promise<formatos_torneo | undefined> {
        const _id = new ObjectId(item.id)
        return (await formatos_torneos.findOne({_id})) || undefined
    }

    public async add(item: formatos_torneo): Promise<formatos_torneo | undefined> {
        item._id = (await formatos_torneos.insertOne(item)).insertedId
        return item
    }

    public async update(item: formatos_torneo): Promise<formatos_torneo | undefined> {
        const {id, ...formatosInput} = item
        const _id = new ObjectId(id)
        return (await formatos_torneos.findOneAndUpdate({_id},{$set: item},{returnDocument: 'after'})) || undefined
  }


  public async delete(item: { id: string }): Promise<formatos_torneo | undefined> {
    const _id = new ObjectId(item.id)
        return (await formatos_torneos.findOneAndDelete({_id})) || undefined
  }
}
   