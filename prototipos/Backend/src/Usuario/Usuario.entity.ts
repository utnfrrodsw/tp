import { ObjectId } from "mongodb";


export class Usuario{
    constructor(
        public nombre: string,
        public apellido: string,
        public email: string,
        public direccion: string,
        public localidad: string,
        public avatar: string,
        public tipo: string,
        public _id ?: ObjectId,
        ){}
}