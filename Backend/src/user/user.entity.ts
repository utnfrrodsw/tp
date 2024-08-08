import crypto from "node:crypto"

export class User {
    constructor(
        public name:string, 
        public email:string, 
        public birthdate: string, 
        public pass: string,
        public id = crypto.randomUUID()
    ){}
}