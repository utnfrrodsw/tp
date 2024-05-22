import { repository } from "../shared/repository.js";
import { Autor } from "./autor.entity.js";

const autores = [
  new Autor("Arthur", "Conan doyle"),
  new Autor("Edgard", "Allan Poe"),
];

export class AutorRepositorio implements repository<Autor> {
  public findAll(): Autor[] | undefined {
    return autores;
  }

  public findOne(item: { id: string }): Autor | undefined {
    const autor = autores.find(
      (autorActual) => autorActual.idAutor === item.id
    );
    return autor;
  }

  public add(item: Autor): Autor | undefined {
    autores.push(item);
    return item;
  }

  public update(item: Autor): Autor | undefined {
    const idArray = autores.findIndex(
      (autorActual) => autorActual.idAutor === item.idAutor
    );
    if (idArray !== -1) {
      autores[idArray] = Object.assign({}, autores[idArray], item);
    }
    return autores[idArray];
  }
  public delete(item: { id: string }): Autor | undefined {
    const idArray = autores.findIndex(
      (autorActual) => autorActual.idAutor === item.id
    );

    if (idArray !== -1) {
      const autorBorrado = autores[idArray];
      autores.splice(idArray, 1);
      return autorBorrado;
    }
    return undefined; // opcional
  }
}
