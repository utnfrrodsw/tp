import { ObjectId } from 'mongodb';

export class Autor {
    constructor(
        public nombreCompleto: string,
        public perfil: string, // imagen de perfil
        public info: string,
        public _id?: ObjectId
    ) { }
}
