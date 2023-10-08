import crypto from 'node:crypto'
import { ObjectId } from 'mongodb';

export class Editorial{
    constructor(
        public name:string, 
        public categoria: string, 
        public id: string,
        public _id?: ObjectId,
        ){}
}