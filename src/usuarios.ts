import crypto from 'node:crypto';


export class usuario{
    constructor(
        public nombre_usuario:string,
        public contraseña:string,
        public nombre:string, 
        public apellido:string,
        public mail:string,
        public fecha_nacimiento:number,
        public id = crypto.randomUUID()
    ) {}
}