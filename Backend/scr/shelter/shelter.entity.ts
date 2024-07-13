import crypto from 'node:crypto';

export class shelter{
  static id: string;
  constructor(
    public nombre: string, 
    public direccion: string,
    public capacidadMaxima: number,
    public id: string
  ){}
}