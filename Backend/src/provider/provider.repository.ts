import { Repository } from '../shared/repository.js'
import { Provider } from './provider.entity.js'

const providers = [
  new Provider(
    "Viejos Amigos",
    "testcrud@example.com",
    "+54 341 11111111",
    "ejemplo 123",
    "30-10504876-5",

    'a02b91bc-3769-4221-beb1-d7a3aeba7dad'
  ),
]

export class ProviderRepository implements Repository<Provider> {
  public findAll(): Provider[] | undefined {
    return providers
  }

  public findOne(item: { id: string }): Provider | undefined {
    return providers.find((provider) => provider.id === item.id)
  }

  public add(item: Provider): Provider | undefined {
    providers.push(item)
    return item
  }

  public update(item: Provider): Provider | undefined {
    const providerIdx = providers.findIndex((provider) => provider.id === item.id)

    if (providerIdx !== -1) {
      providers[providerIdx] = { ...providers[providerIdx], ...item }
    }
    return providers[providerIdx]
  }

  public delete(item: { id: string }): Provider | undefined {
    const providerIdx = providers.findIndex((provider) => provider.id === item.id)

    if (providerIdx !== -1) {
      const deletedProviders = providers[providerIdx]
      providers.splice(providerIdx, 1)
      return deletedProviders
    }
  }
}