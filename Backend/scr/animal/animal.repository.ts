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

  public findAll(): Animal[] | undefined {
    return animales
  }

  public findOne(item: { id: string }): Animal | undefined {
    return animales.find((animal) => animal.id === item.id);
  }

  public add(item: Animal): Animal | undefined {
    console.log('adding animal', item)
    animales.push(item)
    return item
  }

  public update(item: Animal): Animal | undefined{
    const animalIdx = animales.findIndex((animal) => animal.id === item.id);
    if (animalIdx !== -1) {
      animales[animalIdx]= {...animales[animalIdx], ...item };
    }
    return animales[animalIdx]
  }

  public delete(item: {id: string}): Animal | undefined{
    const animalIdx = animales.findIndex((animal) => animal.id === item.id);
    if (animalIdx !== -1) {
      const deletedAnimal = animales[animalIdx]
      animales.splice(animalIdx, 1);
      return deletedAnimal
    }
  }
}
