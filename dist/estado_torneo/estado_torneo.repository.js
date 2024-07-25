import { estado_torneo } from "./estado_torneo.entity.js";
const estados_torneos = [
    new estado_torneo("4", "Finalizado"),
];
export class estado_torneoRepository {
    async findAll() {
        return estados_torneos;
    }
    async findOne(item) {
        return estados_torneos.find((estado_torneo) => estado_torneo.id === item.id);
    }
    async add(item) {
        estados_torneos.push(item);
        return item;
    }
    async update(item) {
        const estado_torneoIdx = estados_torneos.findIndex((estado_torneo) => estado_torneo.id === item.id);
        if (estado_torneoIdx !== -1) {
            estados_torneos[estado_torneoIdx] = { ...estados_torneos[estado_torneoIdx], ...item };
        }
        return estados_torneos[estado_torneoIdx];
    }
    async delete(item) {
        const estado_torneoIdx = estados_torneos.findIndex((estado_torneo) => estado_torneo.id === item.id);
        if (estado_torneoIdx !== -1) {
            const deletedestados_torneos = estados_torneos[estado_torneoIdx];
            estados_torneos.splice(estado_torneoIdx, 1);
            return deletedestados_torneos;
        }
    }
}
//# sourceMappingURL=estado_torneo.repository.js.map