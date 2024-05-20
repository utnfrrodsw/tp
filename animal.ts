import crypto from 'node:crypto';

export class animal{
  constructor(
    public nombre: string, 
    public fechaRescate: number,
    public fechaNacimientoEStimativa: number,
    public id = crypto.randomUUID()
  ){}
}