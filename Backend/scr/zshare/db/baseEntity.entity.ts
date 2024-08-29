import { PrimaryKey } from "@mikro-orm/core";

export abstract class BaseEntity {

  @PrimaryKey()
  id?: number

  /*
  
  @Property({type: DateTimeType})
  created_at?: new Date()
  
  @Property({type: DateTimeType
  onUpdate: () => new Date})
  updated_at?: new Date()
  
  */ 
}
