import { BaseEntity } from '@/entities/BaseEntity';

export default interface IRepository<T extends BaseEntity> {
  findAll(filters?: Partial<T>): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: number): Promise<void>;
}
