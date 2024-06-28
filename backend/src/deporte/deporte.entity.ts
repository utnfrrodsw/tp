import { ObjectId } from 'mongodb'
import crypto from 'node:crypto'
import { Horario } from '../horarios/horario.entity'

export class Deporte {
   constructor(
    public tipo: string,
    public cupo: number,
    public horario: string,
    public costo: number,
    public _id?: ObjectId  
  ) {}
}