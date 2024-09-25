export interface Repository<T> {
  findAll(): Promise<T[] | undefined>
  findOne(item: { id: string }): Promise<T | undefined>
  add(item: T): Promise<T | undefined>
  update(id: string, item: T): Promise<T | undefined>
  delete(item: { id: string }): Promise<T | undefined>
}
