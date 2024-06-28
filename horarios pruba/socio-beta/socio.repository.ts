import { Repository } from '../shared/repository';
import { Socio } from './socio.entity';

export const socios = [
  new Socio(
    " ",
    " ",
    0,
    0,
    'a02b91bc-3769-4221-beb1-d7a3aeba7dad'
  ),
];

export class SocioRepository implements Repository<Socio> {
  public findAll(): Socio[] | undefined {
    return socios;
  }

  public findOne(item: { id: string }): Socio | undefined {
    return socios.find((socio) => socio.id === item.id);
  }

  public add(item: Socio): Socio | undefined {
    socios.push(item);
    return item;
  }

  public update(item: Socio): Socio | undefined {
    const socioIdx = socios.findIndex((socio) => socio.id === item.id);

    if (socioIdx !== -1) {
      socios[socioIdx] = { ...socios[socioIdx], ...item };
    }

    return socios[socioIdx];
  }

  public delete(item: { id: string }): Socio | undefined {
    const socioIdx = socios.findIndex((socio) => socio.id === item.id);

    if (socioIdx !== -1) {
      const deletedSocio = socios[socioIdx];
      socios.splice(socioIdx, 1);
      return deletedSocio;
    }
  }
}