import { Tipo_participante } from "./tipo_participante.entity.js";
const tipo_participantes = [
    new Tipo_participante("lateral derecho", "3"),
];
export class tipo_participanteRepository {
    async findAll() {
        return tipo_participantes;
    }
    async findOne(item) {
        return tipo_participantes.find((tipo_participante) => tipo_participante.id === item.id);
    }
    async add(item) {
        tipo_participantes.push(item);
        return item;
    }
    async update(item) {
        const tipo_participanteIdx = tipo_participantes.findIndex((tipo_participante) => tipo_participante.id === item.id);
        if (tipo_participanteIdx !== -1) {
            tipo_participantes[tipo_participanteIdx] = { ...tipo_participantes[tipo_participanteIdx], ...item };
        }
        return tipo_participantes[tipo_participanteIdx];
    }
    async delete(item) {
        const tipo_participanteIdx = tipo_participantes.findIndex((tipo_participante) => tipo_participante.id === item.id);
        if (tipo_participanteIdx !== -1) {
            const deletedTipo_participantes = tipo_participantes[tipo_participanteIdx];
            tipo_participantes.splice(tipo_participanteIdx, 1);
            return deletedTipo_participantes;
        }
    }
}
//# sourceMappingURL=tipo_participante.repository.js.map