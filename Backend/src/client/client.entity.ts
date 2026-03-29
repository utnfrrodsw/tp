import crypto from 'node:crypto'

export class Client {
  constructor(
    public name: string,
    public email: string,
    public phoneNum: string,
    public address: string,
    //public drivingLicense: HTMLImageElement,

    public id = crypto.randomUUID()
  ) {}
}