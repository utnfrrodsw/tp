import { Repository } from "../shared/repository.js"
import { Participante } from "./participante.entity.js"
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from "mysql2"

export class ParticipantesRepository implements Repository<Participante>{

    public async findAll(): Promise<Participante[] | undefined> {
        const [participantes] = await pool.query('select * from participantes')
        return participantes as Participante[]
    }

    public async findOne(item: { id: string }): Promise<Participante | undefined> {
        const id = Number.parseInt(item.id)
        const [participantes] = await pool.query<RowDataPacket[]>('select * from participantes where id = ?',[id])
        if(participantes.length ===0){
            return undefined
        }

        const participante = participantes[0] as Participante
        return participante
    }

    public async add(participanteInput: Participante): Promise<Participante | undefined> {
        const {...ParticipanteRow} = participanteInput
        const [result] = await pool.query<ResultSetHeader>('insert into participantes set ?', [ParticipanteRow])
        /*participanteInput.id = result.insertId*/

        return participanteInput
    }

    public async update(id:string, participanteInput: Participante): Promise<Participante | undefined> {
        const participanteId = Number.parseInt(id)
        const {...participanteRow } = participanteInput
        await pool.query('update participantes set ? where id = ?', [participanteRow, participanteId])

        return await this.findOne({id})
    }

    public async delete(item: { id: string; }): Promise<Participante | undefined> {
        try{
        const participanteToDelete = await this.findOne(item)
        const participanteId = Number.parseInt(item.id)
        await pool.query('delete from participantes where id = ?',[participanteId])
        return participanteToDelete
    } catch (error: any){
        throw new Error ('No ha sido posible borrar la participante')
    }

    }
}