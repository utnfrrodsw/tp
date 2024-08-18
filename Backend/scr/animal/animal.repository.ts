import { Repository } from "../zshare/repository.js";
import { Animal } from "./animal.entity.js";

const animales = [
  new Animal(
    'juan',
    '2020-12-03',
    '2020-12-03',
    '1'
  ),
];

export class AnimalRepository implements Repository<Animal>{

  public async findAll(): Promise<Animal[] | undefined> {
    throw new Error('Not implemented');
  }

  public async findOne(item: { id: string }): Promise<Animal | undefined> {
    throw new Error('Not implemented');
  }

  public async add(item: Animal): Promise<Animal | undefined> {
    throw new Error('Not implemented');
  }

  public async update(id: string, item: Animal): Promise<Animal | undefined> {
    throw new Error('Not implemented');
  }

  public async delete(item: {id: string}): Promise<Animal | undefined> {
    throw new Error('Not implemented');
  }
}
