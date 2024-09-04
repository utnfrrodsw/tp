import { pool } from '../shared/db/conn.mysql.js';
export class ParticipantesRepository {
    async findAll() {
        const [participantes] = await pool.query('select * from participantes');
        return participantes;
    }
    async findOne(item) {
        const id = Number.parseInt(item.id);
        const [participantes] = await pool.query('select * from participantes where id = ?', [id]);
        if (participantes.length === 0) {
            return undefined;
        }
        const participante = participantes[0];
        return participante;
    }
    async add(participanteInput) {
        const { ...ParticipanteRow } = participanteInput;
        const [result] = await pool.query('insert into participantes set ?', [ParticipanteRow]);
        /*participanteInput.id = result.insertId*/
        return participanteInput;
    }
    async update(id, participanteInput) {
        const participanteId = Number.parseInt(id);
        const { ...participanteRow } = participanteInput;
        await pool.query('update participantes set ? where id = ?', [participanteRow, participanteId]);
        return await this.findOne({ id });
    }
    async delete(item) {
        try {
            const participanteToDelete = await this.findOne(item);
            const participanteId = Number.parseInt(item.id);
            await pool.query('delete from participantes where id = ?', [participanteId]);
            return participanteToDelete;
        }
        catch (error) {
            throw new Error('No ha sido posible borrar la participante');
        }
    }
}
//# sourceMappingURL=participante.repository.js.map