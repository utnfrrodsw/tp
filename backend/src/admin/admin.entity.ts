import crypto from 'node:crypto';


export class Admin{
    constructor(
        public nombre:string,
        public contraseña:string,
        public apellido:string,
        public mail:string,
        public fecha_nacimiento:string,
        public id: number
    ) {}
}