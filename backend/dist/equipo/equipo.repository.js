import { pool } from '../shared/db/conn.mysql.js';
export class EquiposRepository {
    async findAll() {
        const [equipos] = await pool.query('select * from equipos');
        return equipos;
    }
    async findOne(item) {
        const id = Number.parseInt(item.id);
        const [equipos] = await pool.query('select * from equipos where id = ?', [id]);
        if (equipos.length === 0) {
            return undefined;
        }
        const equipo = equipos[0];
        return equipo;
    }
    async add(equipoInput) {
        const { ...EquipoRow } = equipoInput;
        const [result] = await pool.query('insert into equipos set ?', [EquipoRow]);
        /*equipoInput.id = result.insertId*/
        return equipoInput;
    }
    async update(id, equipoInput) {
        const equipoId = Number.parseInt(id);
        const { ...equipoRow } = equipoInput;
        await pool.query('update equipos set ? where id = ?', [equipoRow, equipoId]);
        return await this.findOne({ id });
    }
    async delete(item) {
        try {
            const equipoToDelete = await this.findOne(item);
            const equipoId = Number.parseInt(item.id);
            await pool.query('delete from equipos where id = ?', [equipoId]);
            return equipoToDelete;
        }
        catch (error) {
            throw new Error('No ha sido posible borrar la equipo');
        }
    }
}
//# sourceMappingURL=equipo.repository.js.map