// import { Paciente } from "../personas.entity.js";
// import { Repository } from "../../../shared/repository.js";
// import { listaPacientes } from "../personas.entity.js";
// import { NotFound, Repeated } from "../../../shared/errors.js";

// type Repetido = {
//   telefono: boolean;
//   dni: boolean;
// };

// function encontrarPaciente(id: string): {
//   indice: number;
//   data: Paciente | undefined;
// } {
//   let i = -1;

//   const paciente = listaPacientes.find((paciente, index) => {
//     if (paciente.id === id) {
//       i = index;
//     }
//     return paciente.id === id;
//   });

//   if (!paciente) throw new NotFound(id);

//   return { indice: i, data: paciente };
// }

// function borrarPaciente(id: string): Paciente | undefined {
//   const pacienteABorrar = encontrarPaciente(id);
//   listaPacientes.splice(pacienteABorrar.indice, 1);

//   return pacienteABorrar.data;
// }

// function checkearDniOTelefonoRepetidos(item: Paciente): void {
//   let repetido: Repetido = {
//     dni: false,
//     telefono: false,
//   };
//   repetido.dni = listaPacientes.some((paciente) => paciente.dni === item.dni);
//   repetido.telefono = listaPacientes.some(
//     (paciente) => paciente.telefono === item.telefono
//   );

//   if (repetido.dni) throw new Repeated("dni", item.dni);
//   else if (repetido.telefono) throw new Repeated("telefono", item.telefono);
// }

// export class PacienteRepository implements Repository<Paciente> {
//   public findAll(): Paciente[] {
//     return listaPacientes;
//   }

//   public findOne(item: { id: string }): Paciente | undefined {
//     const pacienteEncontrado = encontrarPaciente(item.id).data;

//     return pacienteEncontrado;
//   }

//   public add(item: Paciente): Paciente | undefined {
//     checkearDniOTelefonoRepetidos(item);

//     const pacienteNuevo = new Paciente(
//       item.nombre,
//       item.apellido,
//       item.idRol,
//       item.direccion,
//       item.idLocalidad,
//       item.telefono,
//       item.tipoDni,
//       item.dni
//     );

//     if (!pacienteNuevo) return;

//     listaPacientes.push(pacienteNuevo);
//     return pacienteNuevo;
//   }

//   public update(item: Paciente): Paciente | undefined {
//     const pacienteAActualizar = encontrarPaciente(item.id);
//     checkearDniOTelefonoRepetidos(item);

//     if (!pacienteAActualizar.data) return;

//     listaPacientes[pacienteAActualizar.indice] = {
//       ...listaPacientes[pacienteAActualizar.indice],
//       ...item,
//     };

//     return item;
//   }

//   public remove(item: { id: string }): Paciente | undefined {
//     return borrarPaciente(item.id);
//   }
// }
