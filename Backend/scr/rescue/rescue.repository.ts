import { Repository } from "../zshare/repository.js";
import { Rescue } from "./rescue.entity.js";

const rescues = [
  new Rescue(
    '10-04-2024',
    'Perro solitario',
    'el carnicero de la esquina le daba comida',
    '1'
  )
];

export class RescueRepository implements Repository<Rescue>{

  public findAll(): Rescue[] | undefined {
    return rescues
  }

  public findOne(item: { id: string }): Rescue | undefined {
    return rescues.find((rescue) => rescue.id === item.id);
  }

  public add(item: Rescue): Rescue | undefined {
    console.log('adding rescue', item)
    rescues.push(item)
    return item
  }

  public update(item: Rescue): Rescue | undefined{
    const rescueIdx = rescues.findIndex((rescue) => rescue.id === item.id);
    if (rescueIdx !== -1) {
      rescues[rescueIdx]= {...rescues[rescueIdx], ...item };
    }
    return rescues[rescueIdx]
  }

  public delete(item: {id: string}): Rescue | undefined{
    const rescueIdx = rescues.findIndex((rescue) => rescue.id === item.id);
    if (rescueIdx !== -1) {
      const deletedRescue = rescues[rescueIdx]
      rescues.splice(rescueIdx, 1);
      return deletedRescue
    }
  }
}
