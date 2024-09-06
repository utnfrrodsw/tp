/*import { pool } from "../zshare/db/conn.mysql.js";
import { Repository } from "../zshare/repository.js";
import { Person } from "./person.entity.js";

export class PersonRepository implements Repository<Person> {
  public async findAll(): Promise<Person[] | undefined>{
    const [persons] = await pool.query('select * from persons')
    return persons as Person[]
  }

  public async findOne(item: {id: string}): Promise<Person | undefined>{
    throw new Error('Not implemented');
  }
  public async add(item: Person): Promise<Person | undefined>{
    throw new Error('Not implemented');
  }

  public async update(id: string, item: Person): Promise<Person | undefined>{
    throw new Error('Not implemented');
  }

  public async delete(item: {id: string}): Promise<Person | undefined>{
    throw new Error('Not implemented');
  }
}*/
