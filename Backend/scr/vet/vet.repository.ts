import { pool } from "../zshare/db/conn.mysql.js";
import { Repository } from "../zshare/repository.js";
import { Vet } from "./vet.entity.js";

export class VetRepository implements Repository<Vet> {
  public async findAll(): Promise<Vet[] | undefined>{
    const [vets] = await pool.query('select * from vets')
    return vets as Vet[]
  }

  public async findOne(item: {id: string}): Promise<Vet | undefined>{
    throw new Error('Not implemented');
  }
  public async add(item: Vet): Promise<Vet | undefined>{
    throw new Error('Not implemented');
  }

  public async update(id: string, item: Vet): Promise<Vet | undefined>{
    throw new Error('Not implemented');
  }

  public async delete(item: {id: string}): Promise<Vet | undefined>{
    throw new Error('Not implemented');
  }
}