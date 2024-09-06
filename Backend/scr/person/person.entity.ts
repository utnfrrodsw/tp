export class Person{
  constructor(
    public name: string,
    public surname: string,
    public doc_type: string,
    public doc_nro: string,
    public email: string,
    public phone: string,
    public birthdate: Date, //deberia ser DATE
    public address: string,
    public nroCuit?: number, // OPCIONAL PARA CLIENTE a menos que saquemos la herencia
    public id?: number  
  ){}
}
