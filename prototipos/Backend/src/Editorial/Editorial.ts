import crypto from 'node:crypto'
import { ObjectId } from 'mongodb';

export class Editorial {
    constructor(
        public nombre: string,
        public categoria: string, // nombre de la editorial
        public id: string,
        public _id?: ObjectId,
    ) { }
}