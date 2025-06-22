import crypto from 'crypto';
//?Convendría hacer dos clases más, una de Cliente y otra de Prestatario que hereden de Usuario
//?De esta manera, si un usuario tiene
//* Después de la consulta, quedamos en que Cliente y Prestatario se iban a relacionar con Usuario.
export class Usuario {
    //*Si un usuario tiene telefono,nombre,apellido y fechaNacimiento, entonces es Cliente
    //*Si un usuario tiene nombreFantasia y foto entonces es Prestatario
    constructor(id = crypto.randomUUID(), email, contrasena, tipoDoc, numDoc, direccion, 
    //Atributos Cliente
    telefono, nombre, apellido, fechaNacimiento, 
    //Atributos Prestatario
    nombreFantasia, descripcion //! Por el momento dejamos de lado el tema de la foto. Por lo que hablamos //! Generalmente se guarda en una carpeta en nuestro host y después guardamos el string de la ruta //public foto?: string
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
        this.descripcion = descripcion;
    }
}
//# sourceMappingURL=usuario.js.map