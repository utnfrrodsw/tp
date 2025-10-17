import { PrimaryKey, SerializedPrimaryKey } from '@mikro-orm/core'
import { ObjectId } from '@mikro-orm/mongodb'


export abstract class BaseEntity {
    @PrimaryKey()
  _id?: ObjectId = new ObjectId()
//combierte el id de objectId a string
  @SerializedPrimaryKey() // esto es para que me devuelva el id como string y no como objectId
  id?: string

    /*
    @property({ Type:dateTimeTz})
    createdAt= new Date();

    @property({
    type:dateTimeType, onUpdate:()=> new Date()           es para que se actualice la fecha cada vez que se actualiza el registro , sin unsar un tipo dato equivocado
    })
    updatedAt?= new Date();
    */ 
}