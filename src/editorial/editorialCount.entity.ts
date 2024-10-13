// Entidad virtual.

import { Entity, Property } from "@mikro-orm/core";

@Entity({
  expression:
    "select e.id, e.nombre, " +
    "(count(l.mi_editorial_id)) as cantLibros " +
    "from editorial e " +
    "left join libro l on e.id = l.mi_editorial_id " +
    "group by e.id ",
})
export class editorialCount {
  @Property()
  id!: number;

  @Property()
  nombre!: string;

  @Property()
  cantLibros!: number;
}
