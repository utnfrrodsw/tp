import { pool } from '../shared/db/conn.mysql.js';
export class LocalidadesRepository {
    async findAll() {
        const [localidades] = await pool.query('select * from localidades');
        return localidades;
    }
    async findOne(item) {
        const id = Number.parseInt(item.id);
        const [localidades] = await pool.query('select * from localidades where id = ?', [id]);
        if (localidades.length === 0) {
            return undefined;
        }
        const localidad = localidades[0];
        return localidad;
    }
    async add(localidadInput) {
        const { ...LocalidadRow } = localidadInput;
        const [result] = await pool.query('insert into localidades set ?', [LocalidadRow]);
        /*localidadInput.id = result.insertId*/
        return localidadInput;
    }
    async update(id, localidadInput) {
        const localidadId = Number.parseInt(id);
        const { ...localidadRow } = localidadInput;
        await pool.query('update localidades set ? where id = ?', [localidadRow, localidadId]);
        return await this.findOne({ id });
    }
    async delete(item) {
        try {
            const localidadToDelete = await this.findOne(item);
            const localidadId = Number.parseInt(item.id);
            await pool.query('delete from localidades where id = ?', [localidadId]);
            return localidadToDelete;
        }
        catch (error) {
            throw new Error('No ha sido posible borrar la localidad');
        }
    }
}
//# sourceMappingURL=localidades.repository.js.map