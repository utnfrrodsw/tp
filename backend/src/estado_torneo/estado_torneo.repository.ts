import { Repository } from "../shared/repository.js"
import { estado_torneo } from "./estado_torneo.entity.js"
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'


export class estado_torneoRepository implements Repository<estado_torneo> {

  public async findAll(): Promise<estado_torneo[] | undefined> {
    const [estados_torneos] = await pool.query('Select * from estados_torneos')
    return estados_torneos as estado_torneo[]
  }


  public async findOne(item: { id: string }): Promise<estado_torneo | undefined> {
    const id = Number.parseInt(item.id)
        const [estados_torneos] = await pool.query<RowDataPacket[]>('select * from estados_torneos where id = ?', [id])
        if (estados_torneos.length === 0) {
            return undefined
        }

        const estado_torneos = estados_torneos[0] as estado_torneo
            return estado_torneos
    }
public async add(estados_torneosImput: estado_torneo): Promise<estado_torneo | undefined> {
    const { ...characterRow } = estados_torneosImput
    const [result] = await pool.query<ResultSetHeader>('insert into estados_torneos set ?', [characterRow])
    /*estados_torneosImput.id = result.insertId*/

    return estados_torneosImput
  }


  public async update(id:string, estados_torneosInput: estado_torneo): Promise<estado_torneo| undefined> {
    const estados_torneosId = Number.parseInt(id)
        const { ...estados_torneosRow } = estados_torneosInput
        await pool.query('update estados_torneos set ? where id = ?', [estados_torneosRow, estados_torneosId])

        return await this.findOne({id})
      }


  public async delete(item: { id: string }): Promise<estado_torneo| undefined> {
    try {
      const estados_torneosToDelete = await this.findOne(item)
      const estados_torneosId = Number.parseInt(item.id)
      await pool.query('delete from estados_torneos where id = ?', estados_torneosId)
      return estados_torneosToDelete
    } catch (error: any) {
      throw new Error('unable to delete estado_torneo')
    }
  }
}