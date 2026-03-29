import crypto from 'node:crypto'

export class Employee {
  constructor(
    public name: string,
    public email: string,
    public phoneNum: string,
    public address: string,
    public salary: number,


    public id = crypto.randomUUID()
  ) {}
}