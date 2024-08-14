import { pool } from '../shared/db/conn.mysql.js';
export class tipo_participanteRepository {
    async findAll() {
        const [tipo_participantes] = await pool.query('select * from tipo_participantes');
        return tipo_participantes;
    }
    async findOne(item) {
        const id = Number.parseInt(item.id);
        const [tipo_participantes] = await pool.query('select * from tipo_participantes where id = ?', [id]);
        if (tipo_participantes.length === 0) {
            return undefined;
        }
        const tipo_participante = tipo_participantes[0];
        return tipo_participante;
    }
    async add(tipo_participanteInput) {
        const { ...tipo_participanteRow } = tipo_participanteInput;
        const [result] = await pool.query('insert into tipo_participantes set ?', [tipo_participanteRow]);
        /*tipo_participanteInput.id = result.insertId*/
        return tipo_participanteInput;
    }
    async update(id, tipo_participanteInput) {
        const tipo_participanteId = Number.parseInt(id);
        const { ...tipo_participanteRow } = tipo_participanteInput;
        await pool.query('update tipo_participantes set ? where id = ?', [tipo_participanteRow, tipo_participanteId]);
        return await this.findOne({ id });
    }
    async delete(item) {
        try {
            const tipo_participanteToDelete = await this.findOne(item);
            const tipo_participanteId = Number.parseInt(item.id);
            await pool.query('delete from tipo_participantes where id = ?', tipo_participanteId);
            return tipo_participanteToDelete;
        }
        catch (error) {
            throw new Error('unable to delete tipo_participante');
        }
    }
}
//# sourceMappingURL=tipo_participante.repository.js.map