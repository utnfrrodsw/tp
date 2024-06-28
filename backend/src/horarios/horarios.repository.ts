import { Repository } from '../shared/repository.ts'
import { Horario } from './horario.entity.js';
import { Deporte } from '../deporte/deporte.entity.js';
import { db } from '../shared/db/conn.js'

const deportes = db.collection<Deporte>('deportes')
const deportes2 = deportes.find().toArray()
  
  export class HorarioRepository implements Repository<Horario> {

    public async findAll(): Promise<Horario[] | undefined> {
      const lista_horarios:Horario[][]=[];
      (await deportes2).forEach(deporte => { return lista_horarios.push(deporte.horario);});
    
      return lista_horarios
    }
 
 

    public findOne(item: { id: string }): Promise<Horario[] | undefined> {
      const deporte_id = deportes.find((deporte) => deporte.id === item.id)
      return (await deporte_id.horario)
    }


    public async add( item: Horario, item2: {id:string} ): Horario | undefined {
      const deporte_id = deportes.find((deporte) => deporte.id === item2.id)
      deporte_id?.horario.push(item)

      return item
    }
  
    
    public update(item: Horario): Horario | undefined {
      const horarioIdx = horarios.findIndex((horario) => horario.id === item.id)
  
      if (horarioIdx !== -1) {
        horarios[horarioIdx] = { ...horarios[horarioIdx], ...item }
      }
      return horarios[horarioIdx]
    }
  
    public delete(item: { id: string }): Horario | undefined {
      const horarioIdx = horarios.findIndex((horario) => horario.id === item.id)
  
      if (horarioIdx !== -1) {
        const deletedHorarios = horarios[horarioIdx]
        horarios.splice(horarioIdx, 1)
        return deletedHorarios
      }
    }
  }