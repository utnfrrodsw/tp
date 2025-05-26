import crypto from 'crypto';

//Nos convendría
export class Usuario {
  constructor(
    public id = crypto.randomUUID(),
    public email: string,
    public contrasena: string,
    public tipoDoc: string,
    public numDoc: number,
    public direccion: string,
    //Atributos Cliente
    public telefono?: number,
    public nombre?: string,
    public apellido?: string,
    //Atributos Prestatario
    public fechaNacimiento?: Date,
    public nombreFantasia?: string,
    public foto?: string //aca va url o string y despues cuando hay que mostrarlo se cambia
  ) {}
}
