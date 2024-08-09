import { Repository } from "../shared/repository.js";
import { evento } from "./event.entity.js";

const eventos = [
    new evento (
        "123123",
        'Fiesta de año nuevo',
        3000,
        '¡Celebra el Año Nuevo con nosotros! Disfruta de música, comida y un brindis a la medianoche. ¡Vení y dá la bienvenida al 2024 con estilo!',
        '31/12/2024',
        20,
    ),
]

export class EventoRepository implements Repository<evento>{
    public findAll(): evento[] | undefined{
        return eventos
    }

    public findOne (item: { id: string; }): evento | undefined {
        return eventos.find((evento)=> evento.idEvento === item.id)
    }

    public add(item: evento): evento | undefined {
        eventos.push(item)
        return item
    }

    public update(item: evento): evento | undefined {
        const eventoIDx = eventos.findIndex((evento) => evento.idEvento === item.idEvento)
        if(eventoIDx !== -1){
            eventos[eventoIDx] = { ...eventos[eventoIDx], ...item }
        }
        return eventos[eventoIDx] 
    }

    public delete (item: { id: string; }): evento | undefined {
              const eventoIDx = eventos.findIndex((evento) => evento.idEvento === item.id)
    if(eventoIDx !== -1) {
        const deletedEventos = eventos[eventoIDx]
        eventos.splice(eventoIDx, 1)
        return deletedEventos
        }
    }
}