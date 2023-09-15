import { Repository } from "../shared/repository.js";
import { Categoria } from "./categoria.entity.js";


const categorias = [new Categoria(1, 'carne')];

export class categoriaRepository implements Repository<Categoria>{
  public findAll(): Categoria[] | undefined {
    return categorias;
  }

  public findOne(item: { id: string }): Categoria | undefined {
    return categorias.find((categoria) => categoria.IdCategoria == item.id);
  }

  public add(item: Categoria): Categoria | undefined {
    categorias.push(item);
    return item;
  }

  public update(item: Categoria): Categoria | undefined {
    const index = categorias.findIndex((categoria) => categoria.IdCategoria == item.IdCategoria);
    if (index !== -1) {
      categorias[index] = { ...categorias[index], ...item }

    }
    return item;
  }

  public delete(item: { id: string }): Categoria | undefined {
    const index = categorias.findIndex((categoria) => categoria.IdCategoria == item.id);
    if (index !== -1) {
      const categoriaEliminada = categorias[index];
      categorias.splice(index, 1);
      return categoriaEliminada;
    }
  }
}