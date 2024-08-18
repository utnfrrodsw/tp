import { pool } from "../zshare/db/conn.mysql.js";
import { Repository } from "../zshare/repository.js";
import { Adoption } from "./adoption.entity.js";

export class AdoptionRepository implements Repository<Adoption> {
  public async findAll(): Promise<Adoption[] | undefined>{
    const [adoptions] = await pool.query('select * from adoptions')
    return adoptions as Adoption[]
  }

  public async findOne(item: {id: string}): Promise<Adoption | undefined>{
    throw new Error('Not implemented');
  }
  public async add(item: Adoption): Promise<Adoption | undefined>{
    throw new Error('Not implemented');
  }

  public async update(id: string, item: Adoption): Promise<Adoption | undefined>{
    throw new Error('Not implemented');
  }

  public async delete(item: {id: string}): Promise<Adoption | undefined>{
    throw new Error('Not implemented');
  }
}