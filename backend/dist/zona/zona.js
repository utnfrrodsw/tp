import crypto from 'crypto';
export class zona {
    constructor(
    // tiene sentido de que el id de la zona lo hagamos con crypto? 🙂
    codZona = crypto.randomUUID(), descripcionZona) {
        this.codZona = codZona;
        this.descripcionZona = descripcionZona;
    }
}
//# sourceMappingURL=zona.js.map