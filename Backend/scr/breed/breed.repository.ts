import { pool } from "../zshare/db/conn.mysql.js";
import { Repository } from "../zshare/repository.js";
import { Breed } from "./breed.entity.js";

export class BreedRepository implements Repository<Breed> {
  public async findAll(): Promise<Breed[] | undefined>{
    const [species] = await pool.query('select * from species')
    return species as Breed[]
  }

  public async findOne(item: {id: string}): Promise<Breed | undefined>{
    throw new Error('Not implemented');
  }
  public async add(item: Breed): Promise<Breed | undefined>{
    throw new Error('Not implemented');
  }

  public async update(id: string, item: Breed): Promise<Breed | undefined>{
    throw new Error('Not implemented');
  }

  public async delete(item: {id: string}): Promise<Breed | undefined>{
    throw new Error('Not implemented');
  }
}