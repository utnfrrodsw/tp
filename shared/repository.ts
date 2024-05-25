export interface Repository<T> {
  findAll(): T[] | undefined;
  findOne(item: { id: string }): T | undefined;
  add(item: T): T | undefined;
  update(item: T): T | undefined;
  remove(item: { id: string }): T | undefined;
}
