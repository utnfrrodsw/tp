import { pool } from '../shared/db/conn.mysql.js';
export class AdminsRepository {
    async findAll() {
        const [admins] = await pool.query('select * from admins');
        return admins;
    }
    async findOne(item) {
        const id = Number.parseInt(item.id);
        const [admins] = await pool.query('select * from admins where id = ?', [id]);
        if (admins.length === 0) {
            return undefined;
        }
        const admin = admins[0];
        return admin;
    }
    async add(adminInput) {
        const { ...AdminRow } = adminInput;
        const [result] = await pool.query('insert into admins set ?', [AdminRow]);
        /*adminInput.id = result.insertId*/
        return adminInput;
    }
    async update(id, adminInput) {
        const adminId = Number.parseInt(id);
        const { ...adminRow } = adminInput;
        await pool.query('update admins set ? where id = ?', [adminRow, adminId]);
        return await this.findOne({ id });
    }
    async delete(item) {
        try {
            const adminToDelete = await this.findOne(item);
            const adminId = Number.parseInt(item.id);
            await pool.query('delete from admins where id = ?', [adminId]);
            return adminToDelete;
        }
        catch (error) {
            throw new Error('No ha sido posible borrar la admin');
        }
    }
}
//# sourceMappingURL=admin.repository.js.map