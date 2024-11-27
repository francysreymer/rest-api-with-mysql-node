export default interface IService<T> {
  findAll(filters?: Partial<T>): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(entity: T, id: number): Promise<T>;
  delete(id: number): Promise<void>;
}
