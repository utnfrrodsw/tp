import crypto from 'crypto';
//Nos convendría
export class Usuario {
    constructor(id = crypto.randomUUID(), email, contrasena, tipoDoc, numDoc, direccion, 
    //Atributos Cliente
    telefono, nombre, apellido, 
    //Atributos Prestatario
    fechaNacimiento, nombreFantasia, foto //aca va url o string y despues cuando hay que mostrarlo se cambia
    ) {
        this.id = id;
        this.email = email;
        this.contrasena = contrasena;
        this.tipoDoc = tipoDoc;
        this.numDoc = numDoc;
        this.direccion = direccion;
        this.telefono = telefono;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
        this.nombreFantasia = nombreFantasia;
        this.foto = foto;
    }
}
//# sourceMappingURL=usuario.js.map