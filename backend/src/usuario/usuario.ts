import crypto from 'crypto';

//?Convendría hacer dos clases más, una de Cliente y otra de Prestatario que hereden de Usuario
//?De esta manera, si un usuario tiene

//* Después de la consulta, quedamos en que Cliente y Prestatario se iban a relacionar con Usuario.
export class Usuario {
  //*Si un usuario tiene telefono,nombre,apellido y fechaNacimiento, entonces es Cliente
  //*Si un usuario tiene nombreFantasia y foto entonces es Prestatario
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
    public fechaNacimiento?: Date,
    //Atributos Prestatario
    public nombreFantasia?: string,
    public descripcion?: string //! Por el momento dejamos de lado el tema de la foto. Por lo que hablamos //! Generalmente se guarda en una carpeta en nuestro host y después guardamos el string de la ruta //public foto?: string
  ) {}
}
