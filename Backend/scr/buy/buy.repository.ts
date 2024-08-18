import { Repository } from "../zshare/repository.js";
import { Buy } from "./buy.entity.js";

const buys = [
  new Buy(
    10000,
    12,
    '12/12/2022',
    '12',
)];

export class BuyRepository implements Repository<Buy> {
  public async findAll(): Promise <Buy[] | undefined> {
    throw new Error('Not implemented');
  }

  public async findOne(item: {id: string}): Promise <Buy | undefined> {
    throw new Error('Not implemented');
  }

  public async add(item: Buy): Promise <Buy | undefined> {
    throw new Error('Not implemented');
  }

  public async update(id: string, item: Buy): Promise <Buy | undefined> {
    throw new Error('Not implemented');
  }

  public async delete(item: {id: string}): Promise <Buy | undefined> {
    throw new Error('Not implemented');
  }
}