import { formatos_torneo } from "./formatos_torneo.entity.js";
const formato_torneo = [
    new formatos_torneo(8, 4, 2, "asd")
];
export class Formatos_torneoRepository {
    async findAll() {
        return formato_torneo;
    }
    async findOne(item) {
        return formato_torneo.find((formato) => formato.id === item.id);
    }
    async add(item) {
        formato_torneo.push(item);
        return item;
    }
    async update(item) {
        const formatos_torneoIdx = formato_torneo.findIndex((formato_torneo) => formato_torneo.id === item.id);
        if (formatos_torneoIdx !== -1) {
            formato_torneo[formatos_torneoIdx] = { ...formato_torneo[formatos_torneoIdx], ...item };
        }
        return formato_torneo[formatos_torneoIdx];
    }
    async delete(item) {
        const formatos_torneoIdx = formato_torneo.findIndex((formatos_torneo) => formatos_torneo.id === item.id);
        if (formatos_torneoIdx !== -1) {
            const deletedCharacters = formato_torneo[formatos_torneoIdx];
            formato_torneo.splice(formatos_torneoIdx, 1);
            return deletedCharacters;
        }
    }
}
//# sourceMappingURL=formatos_torneo.Repository.js.map