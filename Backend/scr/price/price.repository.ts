/*
import { pool } from "../zshare/db/conn.mysql.js";
import { Repository } from "../zshare/repository.js";
import { Price } from "./price.entity.js";

export class PriceRepository implements Repository<Price> {
  public async findAll(): Promise<Price[] | undefined>{
    const [prices] = await pool.query('select * from prices')
    return prices as Price[]
  }

  public async findOne(item: {id: string}): Promise<Price | undefined>{
    throw new Error('Not implemented');
  }
  public async add(item: Price): Promise<Price | undefined>{
    throw new Error('Not implemented');
  }

  public async update(id: string, item: Price): Promise<Price | undefined>{
    throw new Error('Not implemented');
  }

  public async delete(item: {id: string}): Promise<Price | undefined>{
    throw new Error('Not implemented');
  }
}*/