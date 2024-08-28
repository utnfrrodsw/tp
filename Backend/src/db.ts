import { DataSource } from "typeorm"
import { User } from "./User/user.entity"
import { Event } from "./Event/event.entity"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "typeormdb",
    entities: [User, Event],
    logging: true,
    synchronize: true
})