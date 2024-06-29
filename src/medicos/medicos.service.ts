import { orm } from "../../shared/orm.js";
import { Medicos } from "../medicos/medicos.entity.js";
import { Service } from "../../shared/service.js";
import { ObjectId } from "mongodb";

const em = orm.em;

export class MedicoService implements Service<Medicos> {
    public async findAll(): Promise<Medicos[] | undefined> {
      return await em.find(Medicos, {});
    }

    public async findOne(item: { id: string }): Promise<Medicos | undefined> {
        return await em.findOneOrFail(Medicos, { _id: new ObjectId(item.id) });
      }
    
    public async add(item: Medicos): Promise<Medicos | undefined> {
      const MedicoCreado = em.create(Medicos, item);
      await em.flush();
      return MedicoCreado;
    }
  
    public async update(item: Medicos): Promise<Medicos | undefined> {
      const medicoAActualizar = await em.findOneOrFail(Medicos, {
        _id: new ObjectId(item.id),
      });
      const medicoActualizado = em.assign(medicoAActualizar, item);
      await em.flush();
      return medicoActualizado;
    }
  
    public async remove(item: { id: string }): Promise<Medicos | undefined> {
      const medicosABorrar = await em.findOneOrFail(Medicos, {
        _id: new ObjectId(item.id),
      });
      em.remove(medicosABorrar);
      await em.flush();
      return medicosABorrar;
    }
}