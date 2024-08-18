import { Repository } from "../zshare/repository.js";
import { Shelter } from "./shelter.entity.js";

const shelters = [
  new Shelter(
    'animales rescatados',
    'san martin 1203',
    15,
    '1'
  )
];

export class ShelterRepository implements Repository<Shelter>{

  public async findAll(): Promise <Shelter[] | undefined> {
    throw new Error('Not implemented');
  }

  public async findOne(item: { id: string }): Promise <Shelter | undefined> {
    throw new Error('Not implemented');
  }

  public async add(item: Shelter): Promise <Shelter | undefined> {
    throw new Error('Not implemented');
  }

  public async update(id: string, item: Shelter): Promise <Shelter | undefined>{
    throw new Error('Not implemented');
  }

  public async delete(item: {id: string}): Promise <Shelter | undefined>{
    throw new Error('Not implemented');
  }
}
