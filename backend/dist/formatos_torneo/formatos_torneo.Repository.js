import { pool } from '../shared/db/conn.mysql.js';
export class Formatos_torneoRepository {
    async findAll() {
        const [formatos_torneo] = await pool.query('Select * from formatos_torneo');
        return formatos_torneo;
    }
    async findOne(item) {
        const id = Number.parseInt(item.id);
        const [formatos_torneos] = await pool.query('select * from formatos_torneo where id = ?', [id]);
        if (formatos_torneos.length === 0) {
            return undefined;
        }
        const formato_torneo = formatos_torneos[0];
        return formato_torneo;
    }
    async add(formatos_torneoInput) {
        const { ...characterRow } = formatos_torneoInput;
        const [result] = await pool.query('insert into formatos_torneo set ?', [characterRow]);
        /*formatos_torneoInput.id = result.insertId*/
        return formatos_torneoInput;
    }
    async update(id, formatos_torneoInput) {
        const formatos_torneoId = Number.parseInt(id);
        const { ...formatos_torneoRow } = formatos_torneoInput;
        await pool.query('update formatos_torneo set ? where id = ?', [formatos_torneoRow, formatos_torneoId]);
        return await this.findOne({ id });
    }
    async delete(item) {
        try {
            const formatos_torneoToDelete = await this.findOne(item);
            const formatos_torneoId = Number.parseInt(item.id);
            await pool.query('delete from formatos_torneo where id = ?', formatos_torneoId);
            return formatos_torneoToDelete;
        }
        catch (error) {
            throw new Error('unable to delete formato_torneo');
        }
    }
}
//# sourceMappingURL=formatos_torneo.Repository.js.map