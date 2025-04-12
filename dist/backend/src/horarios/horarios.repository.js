import { db } from '../shared/db/conn.js';
const deportes = db.collection('deportes');
const deportes2 = deportes.find().toArray();
export class HorarioRepository {
    async findAll() {
        const lista_horarios = [];
        (await deportes2).forEach(deporte => { return lista_horarios.push(deporte.horario); });
        return lista_horarios;
    }
    findOne(item) {
        const deporte_id = deportes.find((deporte) => deporte.id === item.id);
        return (await deporte_id.horario);
    }
    async add(item, item2) {
        const deporte_id = deportes.find((deporte) => deporte.id === item2.id);
        deporte_id?.horario.push(item);
        return item;
    }
    update(item) {
        const horarioIdx = horarios.findIndex((horario) => horario.id === item.id);
        if (horarioIdx !== -1) {
            horarios[horarioIdx] = { ...horarios[horarioIdx], ...item };
        }
        return horarios[horarioIdx];
    }
    delete(item) {
        const horarioIdx = horarios.findIndex((horario) => horario.id === item.id);
        if (horarioIdx !== -1) {
            const deletedHorarios = horarios[horarioIdx];
            horarios.splice(horarioIdx, 1);
            return deletedHorarios;
        }
    }
}
//# sourceMappingURL=horarios.repository.js.map