import { Entity, PrimaryKey, Property, PrimaryKeyProp } from "@mikro-orm/core";

@Entity()
export class PoliticaSancion {
  @PrimaryKey({ autoincrement: false })
  diasHasta!: number;

  [PrimaryKeyProp]?: "diasHasta";

  @Property()
  diasSancion!: number;
}
