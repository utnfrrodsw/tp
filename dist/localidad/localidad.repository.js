import { Localidad } from "./localidad.entity.js";
const localidades = [new Localidad('Buenos Aires')];
export class localidadRepository {
    findAll() {
        return localidades;
    }
    findOne(item) {
        return localidades.find((localidad) => localidad.IdLocalidad == item.id);
    }
    add(item) {
        localidades.push(item);
        return item;
    }
    update(item) {
        const index = localidades.findIndex((localidad) => localidad.IdLocalidad == item.IdLocalidad);
        if (index !== -1) {
            localidades[index] = { ...localidades[index], ...item };
        }
        return item;
    }
    delete(item) {
        const index = localidades.findIndex((localidad) => localidad.IdLocalidad == item.id);
        if (index !== -1) {
            const localidadEliminada = localidades[index];
            localidades.splice(index, 1);
            return localidadEliminada;
        }
    }
}
//# sourceMappingURL=localidad.repository.js.map