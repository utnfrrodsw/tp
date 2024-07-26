import { Repository } from "../shared/repository.js"
import { estado_torneo } from "./estado_torneo.entity.js"
import { db } from '../shared/db/conn.js'
import { ObjectId } from 'mongodb'

const estados_torneos = db.collection<estado_torneo>('Estados_torneos')

export class estado_torneoRepository implements Repository<estado_torneo> {
  
  public async findAll(): Promise<estado_torneo[] | undefined> {
    return await estados_torneos.find().toArray()
  }
  
  public async findOne(item: { id: string }): Promise<estado_torneo | undefined> {
    const _id = new ObjectId(item.id)
    return (await estados_torneos.findOne({_id})) || undefined
  }

  
  public async add(item: estado_torneo): Promise<estado_torneo | undefined> {
    item._id = (await estados_torneos.insertOne(item)).insertedId
    return item
  }

  public async update(item: estado_torneo): Promise<estado_torneo| undefined> {
    const {id, ...estado_torneoInput} = item
        const _id = new ObjectId(id)
        return (await estados_torneos.findOneAndUpdate({_id},{$set: item},{returnDocument: 'after'})) || undefined
  }

  public async delete(item: { id: string }): Promise<estado_torneo| undefined> {
    const _id = new ObjectId(item.id)
    return (await estados_torneos.findOneAndDelete({_id})) || undefined
  }
}