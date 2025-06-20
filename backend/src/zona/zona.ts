
import crypto from 'crypto';
export class zona {
constructor(
    // tiene sentido de que el id de la zona lo hagamos con crypto? 🙂
    public codZona = crypto.randomUUID(),
    public descripcionZona: string
){}
}
