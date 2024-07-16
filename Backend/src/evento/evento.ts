export class evento{
    constructor(
        public idEvento:number,
        public nombre:string,
        public cuposGral:number,
        public descripcion:string,
        public fecha:string, 
        public hora:number, 
    ) {}
}