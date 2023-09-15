import crypto from 'node:crypto';
export class modoEnvio {
    constructor(nombre, precio, id = crypto.randomUUID()) {
        this.nombre = nombre;
        this.precio = precio;
        this.id = id;
    }
}
//# sourceMappingURL=modoEnvio.entity.js.map