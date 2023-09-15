import { Repository } from "../shared/repository.js";
import { Localidad } from "./localidad.entity.js";


const localidades = [new Localidad('Buenos Aires')];

export class localidadRepository implements Repository<Localidad>{
  public findAll(): Localidad[] | undefined {
    return localidades;
  }

  public findOne(item: { id: string }): Localidad | undefined {
    return localidades.find((localidad) => localidad.IdLocalidad == item.id);
  }

  public add(item: Localidad): Localidad | undefined {
    localidades.push(item);
    return item;
  }

  public update(item: Localidad): Localidad | undefined {
    const index = localidades.findIndex((localidad) => localidad.IdLocalidad == item.IdLocalidad);
    if (index !== -1) {
      localidades[index] = { ...localidades[index], ...item }

    }
    return item;
  }

  public delete(item: { id: string }): Localidad | undefined {
    const index = localidades.findIndex((localidad) => localidad.IdLocalidad == item.id);
    if (index !== -1) {
      const localidadEliminada = localidades[index];
      localidades.splice(index, 1);
      return localidadEliminada;
    }
  }
}