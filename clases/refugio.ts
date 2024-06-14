import crypto from 'node:crypto';

export class refugio{
  static id: string;
  constructor(
    public nombre: string, 
    public direccion: string,
    public capacidadMaxima: number,
    public id: string
  ){}
}