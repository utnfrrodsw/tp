import { pool } from "../zshare/db/conn.mysql.js";
import { Repository } from "../zshare/repository.js";
import { Zone } from "./zone.entity.js";

export class ZoneRepository implements Repository<Zone> {
  public async findAll(): Promise<Zone[] | undefined>{
    const [zones] = await pool.query('select * from zones')
    return zones as Zone[]
  }

  public async findOne(item: {id: string}): Promise<Zone | undefined>{
    throw new Error('Not implemented');
  }
  public async add(item: Zone): Promise<Zone | undefined>{
    throw new Error('Not implemented');
  }

  public async update(id: string, item: Zone): Promise<Zone | undefined>{
    throw new Error('Not implemented');
  }

  public async delete(item: {id: string}): Promise<Zone | undefined>{
    throw new Error('Not implemented');
  }
}