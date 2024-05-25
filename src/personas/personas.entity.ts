import crypto from "node:crypto";

export class Persona {
  constructor(
    public nombre: string,
    public apellido: string,
    public idRol: string,
    public telefono: string,
    public direccion: string,
    public idLocalidad: string,
    public id = crypto.randomUUID()
  ) {}
}

export class Paciente extends Persona {
  constructor(
    nombre: string,
    apellido: string,
    idRol: string,
    direccion: string,
    idLocalidad: string,
    telefono: string,
    public tipoDni: string,
    public dni: string,
    public id = crypto.randomUUID()
  ) {
    super(nombre, apellido, idRol, direccion, idLocalidad, telefono, id);
  }
}

// export class Medico extends Persona {
//   constructor(
//     nombre: string,
//     apellido: string,
//     rol: string,
//     public especialidad: string,
//     id: string = crypto.randomUUID()
//   ) {
//     super(nombre, apellido, rol, id);
//   }
// public get fullName(): string {
//   return this.nombre + " " + this.apellido;
// }
// }

export const listaPacientes: Paciente[] = [
  new Paciente(
    "Lucas",
    "Pérez",
    "2",
    "1234567890",
    "Calle 1",
    "123",
    "dni",
    "38765412"
  ),
  new Paciente(
    "Martina",
    "Sosa",
    "2",
    "2345678901",
    "Avenida 2",
    "456",
    "dni",
    "40123789"
  ),
  new Paciente(
    "Ana",
    "Martínez",
    "2",
    "3456789012",
    "Calle 3",
    "789",
    "dni",
    "37289651"
  ),
  new Paciente(
    "Carlos",
    "López",
    "2",
    "4567890123",
    "Avenida 4",
    "1011",
    "dni",
    "38920137"
  ),
  new Paciente(
    "Gabriela",
    "González",
    "2",
    "5678901234",
    "Calle 5",
    "1213",
    "dni",
    "40928567"
  ),
  new Paciente(
    "Federico",
    "Ramos",
    "2",
    "6789012345",
    "Avenida 6",
    "1415",
    "dni",
    "38810574"
  ),
  new Paciente(
    "Cecilia",
    "Fernández",
    "2",
    "7890123456",
    "Calle 7",
    "1617",
    "dni",
    "40012598"
  ),
  new Paciente(
    "Joaquín",
    "Rodríguez",
    "2",
    "8901234567",
    "Avenida 8",
    "1819",
    "dni",
    "41235467"
  ),
  new Paciente(
    "Silvia",
    "Morales",
    "2",
    "9012345678",
    "Calle 9",
    "2021",
    "dni",
    "38945218"
  ),
  new Paciente(
    "Andrés",
    "Díaz",
    "2",
    "0123456789",
    "Avenida 10",
    "2223",
    "dni",
    "37689231"
  ),
  new Paciente(
    "Sofía",
    "Rojas",
    "2",
    "0987654321",
    "Calle 11",
    "2425",
    "dni",
    "39458012"
  ),
  new Paciente(
    "Ricardo",
    "Vega",
    "2",
    "9876543210",
    "Avenida 12",
    "2627",
    "dni",
    "38420136"
  ),
  new Paciente(
    "Natalia",
    "Castro",
    "2",
    "8765432109",
    "Calle 13",
    "2829",
    "dni",
    "40125896"
  ),
  new Paciente(
    "Mariano",
    "Bravo",
    "2",
    "7654321098",
    "Avenida 14",
    "3031",
    "dni",
    "39127654"
  ),
  new Paciente(
    "Elena",
    "Paz",
    "2",
    "6543210987",
    "Calle 15",
    "3233",
    "dni",
    "40312587"
  ),
  new Paciente(
    "Julián",
    "Rey",
    "2",
    "5432109876",
    "Avenida 16",
    "3435",
    "dni",
    "40876542"
  ),
  new Paciente(
    "Camila",
    "García",
    "2",
    "4321098765",
    "Calle 17",
    "3637",
    "dni",
    "39924158"
  ),
  new Paciente(
    "Alejandro",
    "Ortiz",
    "2",
    "3210987654",
    "Avenida 18",
    "3839",
    "dni",
    "39258401"
  ),
  new Paciente(
    "Valentina",
    "Ruiz",
    "2",
    "2109876543",
    "Calle 19",
    "4041",
    "dni",
    "38641259"
  ),
  new Paciente(
    "Tomás",
    "Pacheco",
    "2",
    "1098765432",
    "Avenida 20",
    "4243",
    "dni",
    "39812347"
  ),
  new Paciente(
    "Liliana",
    "Cruz",
    "2",
    "0987654321",
    "Calle 21",
    "4445",
    "dni",
    "40581629"
  ),
  new Paciente(
    "Guillermo",
    "Luna",
    "2",
    "9876543210",
    "Avenida 22",
    "4647",
    "dni",
    "39187524"
  ),
  new Paciente(
    "Paula",
    "Vázquez",
    "2",
    "8765432109",
    "Calle 23",
    "4849",
    "dni",
    "40715986"
  ),
  new Paciente(
    "Juan",
    "Moreno",
    "2",
    "7654321098",
    "Avenida 24",
    "5051",
    "dni",
    "40238961"
  ),
  new Paciente(
    "Lorena",
    "Torres",
    "2",
    "6543210987",
    "Calle 25",
    "5253",
    "dni",
    "39654823"
  ),
  new Paciente(
    "Mauro",
    "Rivera",
    "2",
    "5432109876",
    "Avenida 26",
    "5455",
    "dni",
    "39986542"
  ),
  new Paciente(
    "María",
    "Cabrera",
    "2",
    "4321098765",
    "Calle 27",
    "5657",
    "dni",
    "40021987"
  ),
  new Paciente(
    "Santiago",
    "Castellanos",
    "2",
    "3210987654",
    "Avenida 28",
    "5859",
    "dni",
    "39102746"
  ),
];
