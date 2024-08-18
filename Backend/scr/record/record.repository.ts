import { pool } from "../zshare/db/conn.mysql.js";
import { Repository } from "../zshare/repository.js";
import { Record } from "./record.entity.js";

export class RecordRepository implements Repository<Record> {
  public async findAll(): Promise<Record[] | undefined>{
    const [records] = await pool.query('select * from records')
    return records as Record[]
  }

  public async findOne(item: {id: string}): Promise<Record | undefined>{
    throw new Error('Not implemented');
  }
  public async add(item: Record): Promise<Record | undefined>{
    throw new Error('Not implemented');
  }

  public async update(id: string, item: Record): Promise<Record | undefined>{
    throw new Error('Not implemented');
  }

  public async delete(item: {id: string}): Promise<Record | undefined>{
    throw new Error('Not implemented');
  }
}