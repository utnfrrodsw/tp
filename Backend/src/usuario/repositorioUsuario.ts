import { User } from "./usuario";

export interface Repository<T> {
    findAll(): T[] | undefined
    findOne(item: { id: string }): T | undefined
    add(item: T): T | undefined
    update(item: T): T | undefined
    delete(item: {id: string}): T | undefined 
}

const users = [
    new User(
        'Tomas Yasparra',
        "tomas@gmail.com",
        "01/05/2001",
        "contrasenia123",
        'a02b91bc-3769-4221-beb1-d7a3aeba7dad'
    ),
]


export class UserRepository implements Repository<User>{
    public findAll(): User[] | undefined{
        return users
    }

    public findOne(item: { id: string; }): User | undefined {
        return users.find((User)=>User.id === item.id)
    }

    public add(item: User): User | undefined {
        users.push(item)
        return item
    }

    public update(item: User): User | undefined {
        const eventoIDx = users.findIndex((User) => User.id === item.id)
        if(eventoIDx !== -1){
            users[eventoIDx] = { ...users[eventoIDx], ...item }
        }
        return users[eventoIDx] 
    }

    public delete(item: { id: string; }): User | undefined {
              const eventoIDx = users.findIndex((User) => User.id === item.id)
    if(eventoIDx !== -1) {
        const deletedEventos = users[eventoIDx]
        users.splice(eventoIDx, 1)
        return deletedEventos
        }
    }
}