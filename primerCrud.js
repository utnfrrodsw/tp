'use strict';

import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });
export class Persona {
  constructor(dni, nombre, apellido, telefono, mail) {
    this.dni = dni;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.mail = mail;
  }
}

try {
  const dni = await rl.question('Ingrese el dni: \n');
  const nombre = await rl.question('Ingrese el nombre: \n');
  const apellido = await rl.question('Ingrese el apellido: \n');
  const telefono = await rl.question('Ingrese el telefono: \n');
  const mail = await rl.question('Ingrese el mail: \n');

  const persona = new Persona(dni, nombre, apellido, telefono, mail);
  console.log(persona);
} catch {
  console.log('Error');
} finally {
  rl.close();
}
