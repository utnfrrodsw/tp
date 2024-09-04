import { Repository } from "../shared/repository.js"
import { Torneo } from "./torneo.entity.js"
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from "mysql2"

export class TorneosRepository implements Repository<Torneo>{

    public async findAll(): Promise<Torneo[] | undefined> {
        const [torneos] = await pool.query('select * from torneos')
        return torneos as Torneo[]
    }

    public async findOne(item: { id: string }): Promise<Torneo | undefined> {
        const id = Number.parseInt(item.id)
        const [torneos] = await pool.query<RowDataPacket[]>('select * from torneos where id = ?',[id])
        if(torneos.length ===0){
            return undefined
        }

        const torneo = torneos[0] as Torneo
        return torneo
    }

    public async add(torneoInput: Torneo): Promise<Torneo | undefined> {
        const {...TorneoRow} = torneoInput
        const [result] = await pool.query<ResultSetHeader>('insert into torneos set ?', [TorneoRow])
        /*torneoInput.id = result.insertId*/

        return torneoInput
    }

    public async update(id:string, torneoInput: Torneo): Promise<Torneo | undefined> {
        const torneoId = Number.parseInt(id)
        const {...torneoRow } = torneoInput
        await pool.query('update torneos set ? where id = ?', [torneoRow, torneoId])

        return await this.findOne({id})
    }

    public async delete(item: { id: string; }): Promise<Torneo | undefined> {
        try{
        const torneoToDelete = await this.findOne(item)
        const torneoId = Number.parseInt(item.id)
        await pool.query('delete from torneos where id = ?',[torneoId])
        return torneoToDelete
    } catch (error: any){
        throw new Error ('No ha sido posible borrar la torneo')
    }

    }
}