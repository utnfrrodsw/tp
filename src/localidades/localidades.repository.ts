import { Repository } from "../shared/repository.js";
import { Localidad } from "./localidades.entity.js";

const localidades =[
    new Localidad(
        'Rosario',
        '1b587da1-a2d0-4405-8381-850e35068ab9'
    )
]

export class LocalidadesRepository implements Repository<Localidad>{

    public findAll(): Localidad[] | undefined {
        return localidades
    }

    public findOne(item: { id: string; }): Localidad | undefined {
        return localidades.find((localidad) => localidad.id === item.id)
    }

    public add(item: Localidad): Localidad | undefined {
        localidades.push(item)
        return item
    }

    public update(item: Localidad): Localidad | undefined {
        const localidadIdx = localidades.findIndex(localidad => localidad.id === item.id)
        if(localidadIdx !== -1){
        localidades[localidadIdx] = {...localidades[localidadIdx], ...item}
        return item
        }
    }

    public delete(item: { id: string; }): Localidad | undefined {
        const localidadIdx = localidades.findIndex(localidad => localidad.id === item.id)
        if(localidadIdx !== -1){
        const localidadBorrada = localidades[localidadIdx]
        localidades.splice(localidadIdx,1)
        return localidadBorrada
        }
    }
}