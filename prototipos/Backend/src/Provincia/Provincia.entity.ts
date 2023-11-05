import { ObjectId } from 'mongodb';

export class Provincia {
    constructor(
        public id: string,
        public descripcion: string,
        public _id?: ObjectId,
    ) { }
}
