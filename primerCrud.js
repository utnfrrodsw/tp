'use strict';

import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { Persona } from './clases.js';
import { eliminarPersona } from './borrar.js';
import { buscaIndice } from './busca_indice.js';
import { buscodni } from './recuperar.js';
const personas = [];
const rl = readline.createInterface({ input, output });
main();

async function main() {
  let opcion;
  do {
    console.log(
      '\n1-CREAR PERSONA\n2-BUSCAR PERSONA\n3-MODIFICAR PERSONA\n4-BORRAR PERSONA\n5-VER TODOS\n6-SALIR'
    );
    opcion = Number.parseInt(
      await rl.question('\nIngrese la opción a la que quiere acceder: \n')
    );
    switch (opcion) {
      case 1:
        await ingresarPersona();
        break;
      case 2:
        if (personasEstaVacio()) {
          console.log(
            '\nNo se puede buscar ninguna persona porque no hay ninguna persona cargada aún\n'
          );
        } else {
          await buscarPersona();
        }
        break;
      case 3:
        if (personasEstaVacio()) {
          console.log(
            '\nNo se puede modificar ninguna persona porque no hay ninguna persona cargada aún\n'
          );
        } else {
          await modificarPersona();
        }
        break;
      case 4:
        if (personasEstaVacio()) {
          console.log(
            '\nNo se puede borrar ninguna persona porque no hay ninguna persona cargada aún\n'
          );
        } else {
          await borrarPersona();
        }
        break;
      case 5:
        if (personasEstaVacio()) {
          console.log('\nAún no se ha cargado ninguna persona');
        } else {
          verTodos();
        }

        break;
    }
  } while (opcion !== 6);
  rl.close();
}

async function ingresarPersona() {
  try {
    const persona = await crearPersona();
    console.log(persona);
    personas.push(persona);
  } catch (error) {
    console.log('Error al ingresar la persona:', error);
  }
}

const crearPersona = async () => {
  const dni = await rl.question('Ingrese el dni: \n');
  const nombre = await rl.question('Ingrese el nombre: \n');
  const apellido = await rl.question('Ingrese el apellido: \n');
  const telefono = await rl.question('Ingrese el telefono: \n');
  const mail = await rl.question('Ingrese el mail: \n');
  const persona = new Persona(dni, nombre, apellido, telefono, mail);
  return persona;
};

async function buscarPersona() {
  try {
    const dnibuscado = await rl.question(
      'Ingrese el dni de la persona que desea buscar:\n'
    );
    const personaEncontrada = buscodni(personas, dnibuscado);
    if (personaEncontrada) {
      console.log('Persona encontrada:', personaEncontrada);
    } else {
      console.log('No se encontró ninguna persona con ese DNI.');
    }
  } catch (error) {
    console.log('Error al buscar la persona:', error);
  }
}



const verTodos = () => {
  console.log(JSON.stringify(personas, null, 2));
};

const modificarPersona = async () => {
  try {
    const dnibuscado = await rl.question(
      'Ingrese el dni de la persona que desea buscar:\n'
    );
    const persona = buscodni(personas, dnibuscado);
    if (!persona) {
      console.log('\nLa persona ingresada no existe\n');
      return; // Salir de la función si la persona no existe
    }

    console.log(`Persona encontrada: ${JSON.stringify(persona)}`);

    let opcion;
    do {
      console.log(
        '\n1-Nombre\n2-Apellido\n3-Mail\n4-Teléfono\n5-SALIR'
      );
      opcion = Number.parseInt(
        await rl.question('\nIngrese la opción que quiere modificar: \n')
      );

      switch (opcion) {
        case 1:
          let new_name = await rl.question('Ingrese el nuevo nombre: \n');
          persona.nombre = new_name;
          console.log('\nPersona modificada con éxito');
          console.log(`Persona con su nuevo nombre: ${JSON.stringify(persona)}`)
          break;

        case 2:
          let new_surname = await rl.question('Ingrese el nuevo apellido: \n');
          persona.apellido = new_surname;
          console.log('\nPersona modificada con éxito');
          console.log(`Persona con su nuevo apellido: ${JSON.stringify(persona)}`);
          break;

        case 3:
          let new_email = await rl.question('Ingrese el nuevo mail: \n');
          persona.mail = new_email;
          console.log('\nPersona modificada con éxito');
          console.log(`Persona con su nuevo mail: ${JSON.stringify(persona)}`);
          break;

        case 4:
          let new_phone = await rl.question('Ingrese el nuevo número de teléfono: \n');
          persona.telefono = new_phone;
          console.log('\nPersona modificada con éxito');
          console.log(`Persona con su nuevo numero de teléfono: ${JSON.stringify(persona)}`);
          break;
      }
    } while (opcion !== 5);
  } catch (error) {
    console.log('Error al modificar la persona: ', error);
  }
};


const personasEstaVacio = () => {
  return personas.length === 0 ? true : false;
};
console.log(personas);
const borrarPersona = async () => {
  try {
    const dnibuscado = await rl.question(
      'Ingrese el dni de la persona que desea borrar:\n'
    );
    const indice = buscaIndice(personas,dnibuscado);
    if (indice === -1) {
      console.log('\nEl dni ingresado no existe\n');
    } else {
      eliminarPersona(personas,indice);
    }
  } catch (error) {
    console.log(error);
  }
};
