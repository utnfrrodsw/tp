import { Repository } from "../shared/repository.js";
import { formatos_torneo } from "./formatos_torneo.entity.js";

const formato_torneo = [
    new formatos_torneo(
        8,
        4,
        2,
        "asd"
    )
];

export class Formatos_torneoRepository implements Repository<formatos_torneo> {
    public findAll(): formatos_torneo[] | undefined {
        return formato_torneo;
    }

    public findOne(item: { id: string }): formatos_torneo | undefined {
        return formato_torneo.find((formato) => formato.id === item.id);
    }

    public add(item: formatos_torneo): formatos_torneo | undefined {
        formato_torneo.push(item);
        return item;
    }

    public update(item: formatos_torneo): formatos_torneo | undefined {
        const formatos_torneoIdx = formato_torneo.findIndex((formato_torneo) => formato_torneo.id === item.id)

    if (formatos_torneoIdx !== -1) {
        formato_torneo[formatos_torneoIdx] = { ...formato_torneo[formatos_torneoIdx], ...item }
    }
    return formato_torneo[formatos_torneoIdx]
  }


  public delete(item: { id: string }): formatos_torneo | undefined {
    const formatos_torneoIdx = formato_torneo.findIndex((formatos_torneo) => formatos_torneo.id === item.id)

    if (formatos_torneoIdx !== -1) {
      const deletedCharacters = formato_torneo[formatos_torneoIdx]
      formato_torneo.splice(formatos_torneoIdx, 1)
      return deletedCharacters
    }
  }
}
    