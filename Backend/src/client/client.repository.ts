import { Repository } from '../shared/repository.js'
import { Client } from './client.entity.js'

const clients = [
  new Client(
    "Ricardo Tabacman",
    "testcrud@example.com",
    "+54 341 11111111",
    "ejemplo 123",

    'a02b91bc-3769-4221-beb1-d7a3aeba7dad'
  ),
]

export class ClientRepository implements Repository<Client> {
  public findAll(): Client[] | undefined {
    return clients
  }

  public findOne(item: { id: string }): Client | undefined {
    return clients.find((clients) => clients.id === item.id)
  }

  public add(item: Client): Client | undefined {
    clients.push(item)
    return item
  }

  public update(item: Client): Client | undefined {
    const clientIdx = clients.findIndex((client) => client.id === item.id)

    if (clientIdx !== -1) {
        clients[clientIdx] = { ...clients[clientIdx], ...item }
    }
    return clients[clientIdx]
  }

  public delete(item: { id: string }): Client | undefined {
    const clientIdx = clients.findIndex((client) => client.id === item.id)

    if (clientIdx !== -1) {
      const deletedClients = clients[clientIdx]
      clients.splice(clientIdx, 1)
      return deletedClients
    }
  }
}