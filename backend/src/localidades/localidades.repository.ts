import { Repository } from "../shared/repository.js"
import { Localidad } from "./localidades.entity.js"
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from "mysql2"

export class LocalidadesRepository implements Repository<Localidad>{

    public async findAll(): Promise<Localidad[] | undefined> {
        const [localidades] = await pool.query('select * from localidades')
        return localidades as Localidad[]
    }

    public async findOne(item: { id: string }): Promise<Localidad | undefined> {
        const id = Number.parseInt(item.id)
        const [localidades] = await pool.query<RowDataPacket[]>('select * from localidades where id = ?',[id])
        if(localidades.length ===0){
            return undefined
        }

        const localidad = localidades[0] as Localidad
        return localidad
    }

    public async add(localidadInput: Localidad): Promise<Localidad | undefined> {
        const {...LocalidadRow} = localidadInput
        const [result] = await pool.query<ResultSetHeader>('insert into localidades set ?', [LocalidadRow])
        /*localidadInput.id = result.insertId*/

        return localidadInput
    }

    public async update(id:string, localidadInput: Localidad): Promise<Localidad | undefined> {
        const localidadId = Number.parseInt(id)
        const {...localidadRow } = localidadInput
        await pool.query('update localidades set ? where id = ?', [localidadRow, localidadId])

        return await this.findOne({id})
    }

    public async delete(item: { id: string; }): Promise<Localidad | undefined> {
        try{
        const localidadToDelete = await this.findOne(item)
        const localidadId = Number.parseInt(item.id)
        await pool.query('delete from localidades where id = ?',[localidadId])
        return localidadToDelete
    } catch (error: any){
        throw new Error ('No ha sido posible borrar la localidad')
    }

    }
}