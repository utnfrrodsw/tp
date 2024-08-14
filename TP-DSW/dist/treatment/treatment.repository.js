"use strict";
/*import { Repository } from '../shared/repository.js';
import { Treatment } from './treatment.entity.js';

const treatments: Treatment[] = [new Treatment('001', 'Quimioterapia','interrumpir la formación de células cancerosas')];

export class TreatmentRepository implements Repository<Treatment> {
  public findAll(): Treatment[] | undefined {
    return treatments;
  }

  public findOne(item: { id: string }): Treatment | undefined {
    //por ahora es el id es tipo string
    return treatments.find((treatment) => item.id === treatment.id);
  }

  public add(item: Treatment): Treatment | undefined {
    treatments.push(item);
    return item;
  }

  public update(item: Treatment): Treatment | undefined {
    const treatmentId = treatments.findIndex(
      (treatments) => treatments.id === item.id
    );
    if (treatmentId !== -1) {
      Object.assign(treatments[treatmentId], item);
    }
    return treatments[treatmentId];
  }

  public delete(item: { id: string }): Treatment | undefined {
    const treatmentId = treatments.findIndex(
      (treatment) => treatment.id === item.id
    );
    if (treatmentId !== -1) {
      const delTreatment = treatments[treatmentId];
      treatments.splice(treatmentId, 1);
      return delTreatment;
    }
  }
}*/
//# sourceMappingURL=treatment.repository.js.map