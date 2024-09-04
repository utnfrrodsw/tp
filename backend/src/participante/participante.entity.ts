import crypto from 'node:crypto';


export class Participante{
    constructor(
        public nombre:string,
        public contraseña:string,
        public apellido:string,
        public mail:string,
        public fecha_nacimiento:string,
        public tipo_par: string,
        public id: number
    ) {}
}