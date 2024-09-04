import { Repository } from "../shared/repository.js"
import { Equipo } from "./equipo.entity.js"
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from "mysql2"

export class EquiposRepository implements Repository<Equipo>{

    public async findAll(): Promise<Equipo[] | undefined> {
        const [equipos] = await pool.query('select * from equipos')
        return equipos as Equipo[]
    }

    public async findOne(item: { id: string }): Promise<Equipo | undefined> {
        const id = Number.parseInt(item.id)
        const [equipos] = await pool.query<RowDataPacket[]>('select * from equipos where id = ?',[id])
        if(equipos.length ===0){
            return undefined
        }

        const equipo = equipos[0] as Equipo
        return equipo
    }

    public async add(equipoInput: Equipo): Promise<Equipo | undefined> {
        const {...EquipoRow} = equipoInput
        const [result] = await pool.query<ResultSetHeader>('insert into equipos set ?', [EquipoRow])
        /*equipoInput.id = result.insertId*/

        return equipoInput
    }

    public async update(id:string, equipoInput: Equipo): Promise<Equipo | undefined> {
        const equipoId = Number.parseInt(id)
        const {...equipoRow } = equipoInput
        await pool.query('update equipos set ? where id = ?', [equipoRow, equipoId])

        return await this.findOne({id})
    }

    public async delete(item: { id: string; }): Promise<Equipo | undefined> {
        try{
        const equipoToDelete = await this.findOne(item)
        const equipoId = Number.parseInt(item.id)
        await pool.query('delete from equipos where id = ?',[equipoId])
        return equipoToDelete
    } catch (error: any){
        throw new Error ('No ha sido posible borrar la equipo')
    }

    }
}