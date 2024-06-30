export interface Service<T> {
  findAll(): Promise<T[] | undefined>;
  findOne(item: { id: string }): Promise<T | undefined>;
  add(item: T): Promise<T | undefined>;
  update(item: T): Promise<T | undefined>;
  remove(item: { id: string }): Promise<T | undefined>;
}
