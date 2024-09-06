import crypto from 'node:crypto';

export class Shelter{
  static id: string;
  constructor(
    public name: string, 
    public address: string,
    public max_capacity: number,
    public id: string
  ){}
}