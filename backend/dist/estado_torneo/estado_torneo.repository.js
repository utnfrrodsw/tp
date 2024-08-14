import { pool } from '../shared/db/conn.mysql.js';
export class estado_torneoRepository {
    async findAll() {
        const [estados_torneos] = await pool.query('Select * from estados_torneos');
        return estados_torneos;
    }
    async findOne(item) {
        const id = Number.parseInt(item.id);
        const [estados_torneos] = await pool.query('select * from estados_torneos where id = ?', [id]);
        if (estados_torneos.length === 0) {
            return undefined;
        }
        const estado_torneos = estados_torneos[0];
        return estado_torneos;
    }
    async add(estados_torneosImput) {
        const { id, ...characterRow } = estados_torneosImput;
        const [result] = await pool.query('insert into estados_torneos set ?', [characterRow]);
        estados_torneosImput.id = result.insertId;
        return estados_torneosImput;
    }
    async update(id, estados_torneosInput) {
        const estados_torneosId = Number.parseInt(id);
        const { ...estados_torneosRow } = estados_torneosInput;
        await pool.query('update estados_torneos set ? where id = ?', [estados_torneosRow, estados_torneosId]);
        return await this.findOne({ id });
    }
    async delete(item) {
        try {
            const estados_torneosToDelete = await this.findOne(item);
            const estados_torneosId = Number.parseInt(item.id);
            await pool.query('delete from estados_torneos where id = ?', estados_torneosId);
            return estados_torneosToDelete;
        }
        catch (error) {
            throw new Error('unable to delete estado_torneo');
        }
    }
}
//# sourceMappingURL=estado_torneo.repository.js.map