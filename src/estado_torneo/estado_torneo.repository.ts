import { Repository } from "../shared/repository.js"
import { estado_torneo } from "./estado_torneo.entity.js"
import { db } from '../shared/db/conn.js'
import { ObjectId } from 'mongodb'

const estados_torneos = [
    new estado_torneo(
     "4",
     "Finalizado"
    ),
  ]

export class estado_torneoRepository implements Repository<estado_torneo> {
  public async findAll(): Promise<estado_torneo[] | undefined> {
    return estados_torneos
  }
  
  public async findOne(item: { id: string }): Promise<estado_torneo | undefined> {
    return estados_torneos.find((estado_torneo) => estado_torneo.id === item.id)
  }

  
  public async add(item: estado_torneo): Promise<estado_torneo | undefined> {
    estados_torneos.push(item)
    return item
  }

  public async update(item: estado_torneo): Promise<estado_torneo| undefined> {
    const estado_torneoIdx = estados_torneos.findIndex((estado_torneo) => estado_torneo.id === item.id)

    if (estado_torneoIdx !== -1) {
      estados_torneos[estado_torneoIdx] = { ...estados_torneos[estado_torneoIdx], ...item }
    }
    return estados_torneos[estado_torneoIdx]
  }

  public async delete(item: { id: string }): Promise<estado_torneo| undefined> {
    
    const estado_torneoIdx = estados_torneos.findIndex((estado_torneo) =>estado_torneo.id === item.id)
    if (estado_torneoIdx !== -1) {
        const deletedestados_torneos = estados_torneos[estado_torneoIdx]
        estados_torneos.splice(estado_torneoIdx, 1)
        return deletedestados_torneos
      }
    }
  }