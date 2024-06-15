import { Specialty } from './specialty.entity.js';
const specialties = [new Specialty('1', 'Clinico')];
export class SpecialtyRepository {
    findAll() {
        return specialties;
    }
    findOne(item) {
        //por ahora es el id es tipo string
        return specialties.find((specialty) => item.id === specialty.id);
    }
    add(item) {
        specialties.push(item);
        return item;
    }
    update(item) {
        const specialtyId = specialties.findIndex((specialty) => specialty.id === item.id);
        if (specialtyId !== -1) {
            Object.assign(specialties[specialtyId], item);
        }
        return specialties[specialtyId];
    }
    delete(item) {
        const specialtyId = specialties.findIndex((specialty) => specialty.id === item.id);
        if (specialtyId !== -1) {
            const delSpecialty = specialties[specialtyId];
            specialties.splice(specialtyId, 1);
            return delSpecialty;
        }
    }
}
//# sourceMappingURL=specialty.repository.js.map