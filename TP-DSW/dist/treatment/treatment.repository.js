import { Treatment } from './treatment.entity.js';
const treatments = [new Treatment('001', 'Quimioterapia', 'interrumpir la formación de células cancerosas')];
export class TreatmentRepository {
    findAll() {
        return treatments;
    }
    findOne(item) {
        //por ahora es el id es tipo string
        return treatments.find((treatment) => item.id === treatment.id);
    }
    add(item) {
        treatments.push(item);
        return item;
    }
    update(item) {
        const treatmentId = treatments.findIndex((treatments) => treatments.id === item.id);
        if (treatmentId !== -1) {
            Object.assign(treatments[treatmentId], item);
        }
        return treatments[treatmentId];
    }
    delete(item) {
        const treatmentId = treatments.findIndex((treatment) => treatment.id === item.id);
        if (treatmentId !== -1) {
            const delTreatment = treatments[treatmentId];
            treatments.splice(treatmentId, 1);
            return delTreatment;
        }
    }
}
//# sourceMappingURL=treatment.repository.js.map