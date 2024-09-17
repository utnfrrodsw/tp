import { Repository } from "../shared/repository.js"
import { Tipo_participante } from "./tipo_participante.entity.js"
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export class tipo_participanteRepository implements Repository<Tipo_participante> {
  public async findAll(): Promise<Tipo_participante[] | undefined> {
    const [tipo_participantes] = await pool.query('select * from tipo_participantes')
    return tipo_participantes as Tipo_participante[]
}
  public async findOne(item: { id: string }): Promise<Tipo_participante | undefined> {
    const id = Number.parseInt(item.id)
    const [tipo_participantes] = await pool.query<RowDataPacket[]>('select * from tipo_participantes where id = ?', [id])
    if (tipo_participantes.length === 0) {
      return undefined
    }
    const tipo_participante = tipo_participantes[0] as Tipo_participante
    return tipo_participante 
  }

  public async add(tipo_participanteInput: Tipo_participante): Promise<Tipo_participante | undefined> {
    const { ...tipo_participanteRow } = tipo_participanteInput
    const [result] = await pool.query<ResultSetHeader>('insert into tipo_participantes set ?', [tipo_participanteRow])
    /*tipo_participanteInput.id = result.insertId*/
    
    return tipo_participanteInput
  }

  public async update(id:string, tipo_participanteInput: Tipo_participante): Promise<Tipo_participante| undefined> {
    const tipo_participanteId = Number.parseInt(id)
    const {...tipo_participanteRow } = tipo_participanteInput
    await pool.query('update tipo_participantes set ? where id = ?', [tipo_participanteRow, tipo_participanteId])
    
    return await this.findOne({id})
  }

  public async delete(item: { id: string }): Promise<Tipo_participante | undefined> {
    try {
      const tipo_participanteToDelete = await this.findOne(item)
      const tipo_participanteId = Number.parseInt(item.id)
      await pool.query('delete from tipo_participantes where id = ?', tipo_participanteId)
      return tipo_participanteToDelete
    } catch (error: any) {
      throw new Error('unable to delete tipo_participante')
    }
  }
}

