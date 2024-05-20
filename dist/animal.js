import crypto from 'node:crypto';
export class animal {
    constructor(nombre, fechaRescate, fechaNacimientoEStimativa, id = crypto.randomUUID()) {
        this.nombre = nombre;
        this.fechaRescate = fechaRescate;
        this.fechaNacimientoEStimativa = fechaNacimientoEStimativa;
        this.id = id;
    }
}
//# sourceMappingURL=animal.js.map