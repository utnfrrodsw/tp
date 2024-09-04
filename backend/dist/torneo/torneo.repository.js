import { pool } from '../shared/db/conn.mysql.js';
export class TorneosRepository {
    async findAll() {
        const [torneos] = await pool.query('select * from torneos');
        return torneos;
    }
    async findOne(item) {
        const id = Number.parseInt(item.id);
        const [torneos] = await pool.query('select * from torneos where id = ?', [id]);
        if (torneos.length === 0) {
            return undefined;
        }
        const torneo = torneos[0];
        return torneo;
    }
    async add(torneoInput) {
        const { ...TorneoRow } = torneoInput;
        const [result] = await pool.query('insert into torneos set ?', [TorneoRow]);
        /*torneoInput.id = result.insertId*/
        return torneoInput;
    }
    async update(id, torneoInput) {
        const torneoId = Number.parseInt(id);
        const { ...torneoRow } = torneoInput;
        await pool.query('update torneos set ? where id = ?', [torneoRow, torneoId]);
        return await this.findOne({ id });
    }
    async delete(item) {
        try {
            const torneoToDelete = await this.findOne(item);
            const torneoId = Number.parseInt(item.id);
            await pool.query('delete from torneos where id = ?', [torneoId]);
            return torneoToDelete;
        }
        catch (error) {
            throw new Error('No ha sido posible borrar la torneo');
        }
    }
}
//# sourceMappingURL=torneo.repository.js.map