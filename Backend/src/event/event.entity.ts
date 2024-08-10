import crypto from "node:crypto"

export class evento{
    constructor(
        public idEvento = crypto.randomUUID(),
        public nombre:string,
        public cuposGral:number,
        public descripcion:string,
        public fecha:string, 
        public hora:number, 
    ) {}
}