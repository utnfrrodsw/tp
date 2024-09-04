import { Repository } from "../shared/repository.js"
import { Partido } from "./partido.entity.js"
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from "mysql2"

export class PartidosRepository implements Repository<Partido>{

    public async findAll(): Promise<Partido[] | undefined> {
        const [partidos] = await pool.query('select * from partidos')
        return partidos as Partido[]
    }

    public async findOne(item: { id: string }): Promise<Partido | undefined> {
        const id = Number.parseInt(item.id)
        const [partidos] = await pool.query<RowDataPacket[]>('select * from partidos where id = ?',[id])
        if(partidos.length ===0){
            return undefined
        }

        const partido = partidos[0] as Partido
        return partido
    }

    public async add(partidoInput: Partido): Promise<Partido | undefined> {
        const {...PartidoRow} = partidoInput
        const [result] = await pool.query<ResultSetHeader>('insert into partidos set ?', [PartidoRow])
        /*partidoInput.id = result.insertId*/

        return partidoInput
    }

    public async update(id:string, partidoInput: Partido): Promise<Partido | undefined> {
        const partidoId = Number.parseInt(id)
        const {...partidoRow } = partidoInput
        await pool.query('update partidos set ? where id = ?', [partidoRow, partidoId])

        return await this.findOne({id})
    }

    public async delete(item: { id: string; }): Promise<Partido | undefined> {
        try{
        const partidoToDelete = await this.findOne(item)
        const partidoId = Number.parseInt(item.id)
        await pool.query('delete from partidos where id = ?',[partidoId])
        return partidoToDelete
    } catch (error: any){
        throw new Error ('No ha sido posible borrar la partido')
    }

    }
}