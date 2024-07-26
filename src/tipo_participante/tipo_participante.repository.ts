import { Repository } from "../shared/repository.js"
import { Tipo_participante } from "./tipo_participante.entity.js"
import { db } from '../shared/db/conn.js'
import { ObjectId } from 'mongodb'

const tipos_participantes = db.collection<Tipo_participante>('Tipos_participantes')

export class tipo_participanteRepository implements Repository<Tipo_participante> {
  
  public async findAll(): Promise<Tipo_participante[] | undefined> {
    return await tipos_participantes.find().toArray()
  }

  public async findOne(item: { id: string }): Promise<Tipo_participante | undefined> {
    const _id = new ObjectId(item.id)
    return (await tipos_participantes.findOne({_id})) || undefined
  }

  public async add(item: Tipo_participante): Promise<Tipo_participante | undefined> {
    item._id = (await tipos_participantes.insertOne(item)).insertedId
    return item
  }

  public async update(item: Tipo_participante): Promise<Tipo_participante| undefined> {
    const {id, ...tipos_parInput} = item
    const _id = new ObjectId(id)
    return (await tipos_participantes.findOneAndUpdate({_id},{$set: item},{returnDocument: 'after'})) || undefined
  }

  public async delete(item: { id: string }): Promise<Tipo_participante | undefined> {
    const _id = new ObjectId(item.id)
        return (await tipos_participantes.findOneAndDelete({_id})) || undefined
  }
}