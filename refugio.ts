import crypto from 'node:crypto';

export class refugio{
  constructor(
    public nombre: string, 
    public direccion: string,
    public capacidadMaxima: number,
    public id: string
  ){}
}