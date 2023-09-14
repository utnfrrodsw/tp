import crypto from 'node:crypto'

export class Provider {
  constructor(
    public businessName: string,
    public email: string,
    public phoneNum: string,
    public address: string,

    public cuit: string
  ) {}
}