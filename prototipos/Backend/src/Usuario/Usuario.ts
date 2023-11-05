import { ObjectId } from "mongodb";

export class Usuario {
    constructor(
        public id: string,
        public nombre: string,
        public apellido: string,
        public email: string,
        public direccion: string,
        public localidad: ObjectId,
        public avatar: string,
        public tipo: string,
        public _id?: ObjectId
    ) { }
}
