import { ObjectId } from 'mongodb';

export class Autor{
    constructor(
        public nombre:string, 
        public apellido: string, 
        public _id?: ObjectId,
        ){}
}