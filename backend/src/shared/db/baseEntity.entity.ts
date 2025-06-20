<<<<<<< HEAD
import { PrimaryKey } from '@mikro-orm/core';

export abstract class BaseEntity {
  @PrimaryKey()
  id?: number;
=======
import { PrimaryKey } from '@mikro-orm/core'

export abstract class BaseEntity {
  @PrimaryKey()
  id?: number
>>>>>>> origin/luis

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
