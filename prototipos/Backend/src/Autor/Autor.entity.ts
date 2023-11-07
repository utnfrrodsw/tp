import { ObjectId } from 'mongodb';

export class Autor {
    constructor(
        public nombreCompleto: string,
        public perfil: string,
        public info: string,
        public _id?: ObjectId
    ) {}
}