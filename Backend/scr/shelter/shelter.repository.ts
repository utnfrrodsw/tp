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

  public findAll(): Shelter[] | undefined {
    return shelters
  }

  public findOne(item: { id: string }): Shelter | undefined {
    return shelters.find((shelter) => shelter.id === item.id);
  }

  public add(item: Shelter): Shelter | undefined {
    console.log('adding shelter', item)
    shelters.push(item)
    return item
  }

  public update(item: Shelter): Shelter | undefined{
    const shelterIdx = shelters.findIndex((shelter) => shelter.id === item.id);
    if (shelterIdx !== -1) {
      shelters[shelterIdx]= {...shelters[shelterIdx], ...item };
    }
    return shelters[shelterIdx]
  }

  public delete(item: {id: string}): Shelter | undefined{
    const shelterIdx = shelters.findIndex((shelter) => shelter.id === item.id);
    if (shelterIdx !== -1) {
      const deletedShelter = shelters[shelterIdx]
      shelters.splice(shelterIdx, 1);
      return deletedShelter
    }
  }
}
