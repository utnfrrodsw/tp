import { Repository } from '../shared/repository.js'
import { modoEnvio } from './modoEnvio.entity.js'

const modosEnvio = [
  new modoEnvio(
    'Retiro en sucursal',
    500,
  ),
]

export class modoEnvioRepository implements Repository<modoEnvio> {
  public findAll(): modoEnvio[] | undefined {
    return modosEnvio
  }

  public findOne(item: { id: string }): modoEnvio | undefined {
    return modosEnvio.find((modoEnvio) => modoEnvio.id === item.id)
  }

  public add(item: modoEnvio): modoEnvio | undefined {
    modosEnvio.push(item)
    return item
  }

  public update(item: modoEnvio): modoEnvio | undefined {
    const modoEnvioIdx = modosEnvio.findIndex((modoEnvio) => modoEnvio.id === item.id)

    if (modoEnvioIdx !== -1) {
        modosEnvio[modoEnvioIdx] = { ...modosEnvio[modoEnvioIdx], ...item }
    }
    return modosEnvio[modoEnvioIdx]
  }

  public delete(item: { id: string }): modoEnvio | undefined {
    const modoEnvioIdx = modosEnvio.findIndex((modoEnvio) => modoEnvio.id === item.id)

    if (modoEnvioIdx !== -1) {
      const deletedCharacters = modosEnvio[modoEnvioIdx]
      modosEnvio.splice(modoEnvioIdx, 1)
      return deletedCharacters
    }
  }
}
