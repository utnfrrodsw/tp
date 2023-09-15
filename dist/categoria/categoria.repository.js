import { Categoria } from "./categoria.entity.js";
const categorias = [new Categoria(1, 'carne')];
export class categoriaRepository {
    findAll() {
        return categorias;
    }
    findOne(item) {
        return categorias.find((categoria) => categoria.IdCategoria == item.id);
    }
    add(item) {
        categorias.push(item);
        return item;
    }
    update(item) {
        const index = categorias.findIndex((categoria) => categoria.IdCategoria == item.IdCategoria);
        if (index !== -1) {
            categorias[index] = { ...categorias[index], ...item };
        }
        return item;
    }
    delete(item) {
        const index = categorias.findIndex((categoria) => categoria.IdCategoria == item.id);
        if (index !== -1) {
            const categoriaEliminada = categorias[index];
            categorias.splice(index, 1);
            return categoriaEliminada;
        }
    }
}
//# sourceMappingURL=categoria.repository.js.map