export class Person{
  constructor(
    public nombre: string,
    public apellido: string,
    public tipoDoc: string,
    public nroDoc: number, 
    public contacto: string,
    public fechaNacimiento: string, //deberia ser DATE
    public domicilio: string,
    public nroCuit: number, // OPCIONAL PARA CLIENTE a menos que saquemos la herencia
    public id: string  
  ){}
}
