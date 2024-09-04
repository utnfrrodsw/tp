import { Repository } from "../shared/repository.js"
import { Admin } from "./admin.entity.js"
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from "mysql2"

export class AdminsRepository implements Repository<Admin>{

    public async findAll(): Promise<Admin[] | undefined> {
        const [admins] = await pool.query('select * from admins')
        return admins as Admin[]
    }

    public async findOne(item: { id: string }): Promise<Admin | undefined> {
        const id = Number.parseInt(item.id)
        const [admins] = await pool.query<RowDataPacket[]>('select * from admins where id = ?',[id])
        if(admins.length ===0){
            return undefined
        }

        const admin = admins[0] as Admin
        return admin
    }

    public async add(adminInput: Admin): Promise<Admin | undefined> {
        const {...AdminRow} = adminInput
        const [result] = await pool.query<ResultSetHeader>('insert into admins set ?', [AdminRow])
        /*adminInput.id = result.insertId*/

        return adminInput
    }

    public async update(id:string, adminInput: Admin): Promise<Admin | undefined> {
        const adminId = Number.parseInt(id)
        const {...adminRow } = adminInput
        await pool.query('update admins set ? where id = ?', [adminRow, adminId])

        return await this.findOne({id})
    }

    public async delete(item: { id: string; }): Promise<Admin | undefined> {
        try{
        const adminToDelete = await this.findOne(item)
        const adminId = Number.parseInt(item.id)
        await pool.query('delete from admins where id = ?',[adminId])
        return adminToDelete
    } catch (error: any){
        throw new Error ('No ha sido posible borrar la admin')
    }

    }
}