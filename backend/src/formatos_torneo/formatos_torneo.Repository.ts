import { Repository } from "../shared/repository.js"
import { formatos_torneo } from "./formatos_torneo.entity.js"
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'


export class Formatos_torneoRepository implements Repository<formatos_torneo> {
    public async findAll(): Promise<formatos_torneo[] | undefined> {
        const [formatos_torneo] = await pool.query('Select * from formatos_torneo')
        return formatos_torneo as formatos_torneo[]
    }


    public async findOne(item: { id: string }): Promise<formatos_torneo | undefined> {
        const id = Number.parseInt(item.id)
        const [formatos_torneos] = await pool.query<RowDataPacket[]>('select * from formatos_torneos where id = ?', [id])
        if (formatos_torneos.length === 0) {
            return undefined
        }

        const formato_torneo = formatos_torneos[0] as formatos_torneo
            return formato_torneo
    }


    public async add(formatos_torneoInput: formatos_torneo): Promise<formatos_torneo | undefined> {
        const { id, ...characterRow } = formatos_torneoInput
        const [result] = await pool.query<ResultSetHeader>('insert into formatos_torneo set ?', [characterRow])
        formatos_torneoInput.id = result.insertId

    return formatos_torneoInput
  }


    public async update(id:string, formatos_torneoInput: formatos_torneo): Promise<formatos_torneo | undefined> {
        const formatos_torneoId = Number.parseInt(id)
        const {...formatos_torneoRow } = formatos_torneoInput
        await pool.query('update formatos_torneo set ? where id = ?', [formatos_torneoRow, formatos_torneoId])

        return await this.findOne({id})
  }


    public async delete(item: { id: string }): Promise<formatos_torneo | undefined> {
    try {
        const formatos_torneoToDelete = await this.findOne(item)
        const formatos_torneoId = Number.parseInt(item.id)
        await pool.query('delete from formatos_torneo where id = ?', formatos_torneoId)
        return formatos_torneoToDelete
      } catch (error: any) {
        throw new Error('unable to delete formato_torneo')
      }
    }
  }