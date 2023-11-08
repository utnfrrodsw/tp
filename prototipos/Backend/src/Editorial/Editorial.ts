import { ObjectId } from 'mongodb';

export class Editorial {
    constructor(
        public descripcion: string, // nombre de la editorial
        public direccion: string,
        public imagen: string,
        public _id?: ObjectId,
    ) { }
}