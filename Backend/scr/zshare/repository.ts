export interface repository<T> {
  findall(): T[] | undefined
  findOne(item: {id: string}): T | undefined
  add(item: T): T | undefined
  update(item: T): T | undefined
  delete(item: T): T | undefined
}