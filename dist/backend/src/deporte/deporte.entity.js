export class Deporte {
    constructor(tipo, cupo, horario, costo, _id) {
        this.tipo = tipo;
        this.cupo = cupo;
        this.horario = horario;
        this.costo = costo;
        this._id = _id;
    }
}
export const deportes = [
    new Deporte(" ", 0, [], 0),
];
//# sourceMappingURL=deporte.entity.js.map