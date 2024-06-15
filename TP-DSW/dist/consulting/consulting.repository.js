import { Consulting } from "./consulting.entity.js";
const consultings = [
    new Consulting('1', 'Calle 1', 'Calle 2')
];
export class ConsultingRepository {
    findAll() {
        return consultings;
    }
    findOne(item) {
        return consultings.find((consulting) => consulting.id === item.id);
    }
    add(item) {
        consultings.push(item);
        return item;
    }
    update(item) {
        const consultingId = consultings.findIndex((consulting) => consulting.id === item.id);
        if (consultingId !== -1) {
            Object.assign(consultings[consultingId], item);
        }
        return consultings[consultingId];
    }
    delete(item) {
        const consultingId = consultings.findIndex((consulting) => consulting.id === item.id);
        if (consultingId !== -1) {
            const delconsulting = consultings[consultingId];
            consultings.splice(consultingId, 1);
            return delconsulting;
        }
    }
}
//# sourceMappingURL=consulting.repository.js.map