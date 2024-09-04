import { pool } from '../shared/db/conn.mysql.js';
export class PartidosRepository {
    async findAll() {
        const [partidos] = await pool.query('select * from partidos');
        return partidos;
    }
    async findOne(item) {
        const id = Number.parseInt(item.id);
        const [partidos] = await pool.query('select * from partidos where id = ?', [id]);
        if (partidos.length === 0) {
            return undefined;
        }
        const partido = partidos[0];
        return partido;
    }
    async add(partidoInput) {
        const { ...PartidoRow } = partidoInput;
        const [result] = await pool.query('insert into partidos set ?', [PartidoRow]);
        /*partidoInput.id = result.insertId*/
        return partidoInput;
    }
    async update(id, partidoInput) {
        const partidoId = Number.parseInt(id);
        const { ...partidoRow } = partidoInput;
        await pool.query('update partidos set ? where id = ?', [partidoRow, partidoId]);
        return await this.findOne({ id });
    }
    async delete(item) {
        try {
            const partidoToDelete = await this.findOne(item);
            const partidoId = Number.parseInt(item.id);
            await pool.query('delete from partidos where id = ?', [partidoId]);
            return partidoToDelete;
        }
        catch (error) {
            throw new Error('No ha sido posible borrar la partido');
        }
    }
}
//# sourceMappingURL=partido.repository.js.map