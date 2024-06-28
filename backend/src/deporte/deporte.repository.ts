import { Repository } from '../shared/repository.js'
import { Deporte } from './deporte.entity.js';
import { db } from '../shared/db/conn.js'
import { ObjectId } from 'mongodb'

const deportes = db.collection<Deporte>('deportes')

export class DeporteRepository implements Repository<Deporte> {
  public async findAll(): Promise<Deporte[] | undefined> {
    return await deportes.find().toArray()
  }

  public async findOne(item: { id: string }): Promise<Deporte | undefined> {
    const _id = new ObjectId(item.id)
    return (await deportes.findOne({ _id })) || undefined
  }

  public async add(item: Deporte): Promise<Deporte | undefined> {
    item._id = (await deportes.insertOne(item)).insertedId 
    return item
  }

  public async update(id: string, item: Deporte): Promise<Deporte | undefined> {
    const _id = new ObjectId(id)
    return (await deportes.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined
  }

  public async delete(item: { id: string }): Promise<Deporte | undefined> {
    const _id = new ObjectId(item.id)
    return (await deportes.findOneAndDelete({ _id })) || undefined
  }
}