import { Db, ObjectId } from 'mongodb';
import crypto from 'node:crypto';

export class Sucursal{
    constructor(
        public nombre_sucursal: string,
        public localidad: string,
        public id?: Number
    ){}
}