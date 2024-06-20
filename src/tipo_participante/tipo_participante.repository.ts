import { Repository } from "../shared/repository.js"
import { Tipo_participante } from "./tipo_participante.entity.js"

const tipo_participantes = [
    new Tipo_participante(
     "lateral derecho",
     "3"
    ),
  ]

export class tipo_participanteRepository implements Repository<Tipo_participante> {
  public findAll(): Tipo_participante[] | undefined {
    return tipo_participantes
  }
  public findOne(item: { id: string }): Tipo_participante | undefined {
    return tipo_participantes.find((tipo_participante) => tipo_participante.id === item.id)
  }

  public add(item: Tipo_participante): Tipo_participante | undefined {
    tipo_participantes.push(item)
    return item
  }

  public update(item: Tipo_participante): Tipo_participante| undefined {
    const tipo_participanteIdx = tipo_participantes.findIndex((tipo_participante) => tipo_participante.id === item.id)

    if (tipo_participanteIdx !== -1) {
      tipo_participantes[tipo_participanteIdx] = { ...tipo_participantes[tipo_participanteIdx], ...item }
    }
    return tipo_participantes[tipo_participanteIdx]
  }

  public delete(item: { id: string }): Tipo_participante | undefined {
    const tipo_participanteIdx = tipo_participantes.findIndex((tipo_participante) => tipo_participante.id === item.id)
    if (tipo_participanteIdx !== -1) {
        const deletedTipo_participantes = tipo_participantes[tipo_participanteIdx]
        tipo_participantes.splice(tipo_participanteIdx, 1)
        return deletedTipo_participantes
      }
    }
  }