import crypto from "node:crypto";
export class evento {
    constructor(idEvento = crypto.randomUUID(), nombre, cuposGral, descripcion, fecha, hora) {
        this.idEvento = idEvento;
        this.nombre = nombre;
        this.cuposGral = cuposGral;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.hora = hora;
    }
}
//# sourceMappingURL=event.entity.js.map