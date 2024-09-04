import { pool } from '../shared/db/conn.mysql.js';
export class SucursalesRepository {
    async findAll() {
        const [sucursales] = await pool.query('select * from sucursales');
        return sucursales;
    }
    async findOne(item) {
        const id = Number.parseInt(item.id);
        const [sucursales] = await pool.query('select * from sucursales where id = ?', [id]);
        if (sucursales.length === 0) {
            return undefined;
        }
        const Sucursal = sucursales[0];
        return Sucursal;
    }
    async add(SucursalInput) {
        const { ...SucursalRow } = SucursalInput;
        const [result] = await pool.query('insert into sucursales set ?', [SucursalRow]);
        /*SucursalInput.id = result.insertId*/
        return SucursalInput;
    }
    async update(id, SucursalInput) {
        const SucursalId = Number.parseInt(id);
        const { ...SucursalRow } = SucursalInput;
        await pool.query('update sucursales set ? where id = ?', [SucursalRow, SucursalId]);
        return await this.findOne({ id });
    }
    async delete(item) {
        try {
            const SucursalToDelete = await this.findOne(item);
            const SucursalId = Number.parseInt(item.id);
            await pool.query('delete from sucursales where id = ?', [SucursalId]);
            return SucursalToDelete;
        }
        catch (error) {
            throw new Error('No ha sido posible borrar la Sucursal');
        }
    }
}
//# sourceMappingURL=sucursal.repository.js.map