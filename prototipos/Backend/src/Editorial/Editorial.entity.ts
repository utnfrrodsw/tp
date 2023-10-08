import { ObjectId } from 'mongodb';

export class Editorial{
    constructor(
        public  name:string, 
        public categoria: string, 
        public _id?: ObjectId,
        ){}
}