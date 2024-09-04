import { Repository } from "../shared/repository.js";
import { Sucursal } from "./sucursal.entity.js";
import { pool } from '../shared/db/conn.mysql.js';
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class SucursalesRepository implements Repository<Sucursal>{

    public async findAll(): Promise<Sucursal[] | undefined> {
        const [sucursales] = await pool.query('select * from sucursales')
        return sucursales as Sucursal[]
    }

    public async findOne(item: { id: string }): Promise<Sucursal | undefined> {
        const id = Number.parseInt(item.id)
        const [sucursales] = await pool.query<RowDataPacket[]>('select * from sucursales where id = ?',[id])
        if(sucursales.length ===0){
            return undefined
        }

        const Sucursal = sucursales[0] as Sucursal
        return Sucursal
    }

    public async add(SucursalInput: Sucursal): Promise<Sucursal | undefined> {
        const {...SucursalRow} = SucursalInput
        const [result] = await pool.query<ResultSetHeader>('insert into sucursales set ?', [SucursalRow])
        /*SucursalInput.id = result.insertId*/

        return SucursalInput
    }

    public async update(id:string, SucursalInput: Sucursal): Promise<Sucursal | undefined> {
        const SucursalId = Number.parseInt(id)
        const {...SucursalRow } = SucursalInput
        await pool.query('update sucursales set ? where id = ?', [SucursalRow, SucursalId])

        return await this.findOne({id})
    }

    public async delete(item: { id: string; }): Promise<Sucursal | undefined> {
        try{
        const SucursalToDelete = await this.findOne(item)
        const SucursalId = Number.parseInt(item.id)
        await pool.query('delete from sucursales where id = ?',[SucursalId])
        return SucursalToDelete
    } catch (error: any){
        throw new Error ('No ha sido posible borrar la Sucursal')
    }

    }
}