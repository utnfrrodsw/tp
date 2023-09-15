import crypto from 'node:crypto';
export class Localidad {
    constructor(NombreLocalidad, IdLocalidad = crypto.randomUUID()) {
        this.NombreLocalidad = NombreLocalidad;
        this.IdLocalidad = IdLocalidad;
    }
}
//# sourceMappingURL=localidad.entity.js.map