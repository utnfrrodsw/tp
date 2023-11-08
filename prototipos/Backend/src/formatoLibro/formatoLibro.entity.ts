import { ObjectId } from 'mongodb';

export class formatoLibro {
    constructor(
        public descripcion: string,
        public _id?: ObjectId,
    ) { }
}