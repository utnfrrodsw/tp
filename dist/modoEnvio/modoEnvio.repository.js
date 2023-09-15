import { modoEnvio } from './modoEnvio.entity.js';
const modosEnvio = [
    new modoEnvio('Retiro en sucursal', 500),
];
export class modoEnvioRepository {
    findAll() {
        return modosEnvio;
    }
    findOne(item) {
        return modosEnvio.find((modoEnvio) => modoEnvio.id === item.id);
    }
    add(item) {
        modosEnvio.push(item);
        return item;
    }
    update(item) {
        const modoEnvioIdx = modosEnvio.findIndex((modoEnvio) => modoEnvio.id === item.id);
        if (modoEnvioIdx !== -1) {
            modosEnvio[modoEnvioIdx] = { ...modosEnvio[modoEnvioIdx], ...item };
        }
        return modosEnvio[modoEnvioIdx];
    }
    delete(item) {
        const modoEnvioIdx = modosEnvio.findIndex((modoEnvio) => modoEnvio.id === item.id);
        if (modoEnvioIdx !== -1) {
            const deletedCharacters = modosEnvio[modoEnvioIdx];
            modosEnvio.splice(modoEnvioIdx, 1);
            return deletedCharacters;
        }
    }
}
//# sourceMappingURL=modoEnvio.repository.js.map