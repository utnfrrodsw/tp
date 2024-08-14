"use strict";
/*import { Repository } from '../shared/repository.js';
import { Specialty } from './specialty.entity.js';

const specialties: Specialty[] = [new Specialty('1', 'Clinico')];

export class SpecialtyRepository implements Repository<Specialty> {
  public findAll(): Specialty[] | undefined {
    return specialties;
  }

  public findOne(item: { id: string }): Specialty | undefined {
    //por ahora es el id es tipo string
    return specialties.find((specialty) => item.id === specialty.id);
  }

  public add(item: Specialty): Specialty | undefined {
    specialties.push(item);
    return item;
  }

  public update(item: Specialty): Specialty | undefined {
    const specialtyId = specialties.findIndex(
      (specialty) => specialty.id === item.id
    );
    if (specialtyId !== -1) {
      Object.assign(specialties[specialtyId], item);
    }
    return specialties[specialtyId];
  }

  public delete(item: { id: string }): Specialty | undefined {
    const specialtyId = specialties.findIndex(
      (specialty) => specialty.id === item.id
    );
    if (specialtyId !== -1) {
      const delSpecialty = specialties[specialtyId];
      specialties.splice(specialtyId, 1);
      return delSpecialty;
    }
  }
}*/
//# sourceMappingURL=specialty.repository.js.map