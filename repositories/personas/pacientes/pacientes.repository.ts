import { Paciente } from "../../../src/personas/personas.entity";
import { Repository } from "../../../shared/repository";
import { listaPacientes } from "../../../src/personas/personas.entity";

function encontrarPaciente(id: string): {
  indice: number;
  data: Paciente | undefined;
} {
  let i = -1;
  const pacienteABorrar = listaPacientes.find((paciente, index) => {
    if (paciente.id === id) {
      i = index;
    }
    return paciente.id === id;
  });

  return { indice: i, data: pacienteABorrar };
}

export class PacienteRepository implements Repository<Paciente> {
  public findAll(): Paciente[] {
    return listaPacientes;
  }

  public findOne(item: { id: string }): Paciente | undefined {
    //A implementar
    throw new Error();
  }

  public add(item: Paciente): Paciente | undefined {
    //A implementar
    throw new Error();
  }

  public update(item: Paciente): Paciente | undefined {
    //A implementar
    throw new Error();
  }

  public remove(item: { id: string }): Paciente | undefined {
    const paciente = encontrarPaciente(item.id);

    //Agregar validaciones!! (que pasa si no lo encuentra)

    //borra paciente de la lista
    listaPacientes.splice(paciente.indice, 1); []

    return paciente.data;
  }
}
