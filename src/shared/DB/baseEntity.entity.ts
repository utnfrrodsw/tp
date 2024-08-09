import { PrimaryKey } from "@mikro-orm/core";
import { Expose } from "class-transformer";
export abstract class BaseEntity {
  @PrimaryKey()
  @Expose()
  id?: number;

  /*

  @Property({ type: DateTimeType })
  createdAt? = new Date()

  @Property({
    type: DateTimeType,
    onUpdate: () => new Date(),
  })
  updatedAt? = new Date()

  */
}
