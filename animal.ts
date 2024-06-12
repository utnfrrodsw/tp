import crypto from 'node:crypto';

export class animal{
  constructor(
    public nombre: string, 
    public fechaRescate: string,
    public fechaNacimientoEStimativa: string,
    public id: string
  ){}
}
