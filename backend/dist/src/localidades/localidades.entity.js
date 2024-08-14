import crypto from 'node:crypto';
export class Localidad {
    constructor(nombre_localidad, id = crypto.randomUUID(), _id) {
        this.nombre_localidad = nombre_localidad;
        this.id = id;
        this._id = _id;
    }
}
//# sourceMappingURL=localidades.entity.js.map