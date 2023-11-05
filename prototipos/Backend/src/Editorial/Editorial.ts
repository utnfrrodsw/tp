import crypto from 'node:crypto'
import { ObjectId } from 'mongodb';

export class Editorial {
    constructor(
        public id: string,
        public descripcion: string, // nombre de la editorial
        public direccion: string,
        public _id?: ObjectId,
    ) { }
}