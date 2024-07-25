import { Repository } from "../shared/repository.js"
import { formatos_torneo } from "./formatos_torneo.entity.js"
import { db } from '../shared/db/conn.js'
import { ObjectId } from 'mongodb'

const formato_torneo = [
    new formatos_torneo(
        8,
        4,
        2,
        "asd"
    )
];

export class Formatos_torneoRepository implements Repository<formatos_torneo> {
    public async findAll(): Promise<formatos_torneo[] | undefined> {
        return formato_torneo;
    }

    public async findOne(item: { id: string }): Promise<formatos_torneo | undefined> {
        return formato_torneo.find((formato) => formato.id === item.id);
    }

    public async add(item: formatos_torneo): Promise<formatos_torneo | undefined> {
        formato_torneo.push(item);
        return item;
    }

    public async update(item: formatos_torneo): Promise<formatos_torneo | undefined> {
        const formatos_torneoIdx = formato_torneo.findIndex((formato_torneo) => formato_torneo.id === item.id)

    if (formatos_torneoIdx !== -1) {
        formato_torneo[formatos_torneoIdx] = { ...formato_torneo[formatos_torneoIdx], ...item }
    }
    return formato_torneo[formatos_torneoIdx]
  }


  public async delete(item: { id: string }): Promise<formatos_torneo | undefined> {
    const formatos_torneoIdx = formato_torneo.findIndex((formatos_torneo) => formatos_torneo.id === item.id)

    if (formatos_torneoIdx !== -1) {
      const deletedCharacters = formato_torneo[formatos_torneoIdx]
      formato_torneo.splice(formatos_torneoIdx, 1)
      return deletedCharacters
    }
  }
}
    