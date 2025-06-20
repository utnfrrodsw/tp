import { Entity, Property, ManyToMany,Cascade,Rel, Collection,rel, PrimaryKey , BaseEntity } from '@mikro-orm/core'
import { Usuario } from "../usuario/usuario.entity.js"


export class Zona{
    @PrimaryKey()
    codZona !: number


  @Property({nullable: false})
  descripcionZona!: string;

  //apunta a usuario? como hago apuntarla a prestatario?

  @ManyToMany(()=> Usuario, usuario=>usuario.zonas)
  usuarios?: Usuario[]
}