import { injectable } from 'inversify';
import { Repository, FindOptionsWhere } from 'typeorm';

export interface Identifiable {
  id: number;
}

@injectable()
export abstract class BaseRepository<T extends Identifiable> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async findAll(filters?: Partial<T>): Promise<T[]> {
    const queryBuilder = this.repository.createQueryBuilder('entity');

    if (filters) {
      Object.keys(filters).forEach((key) => {
        const value = filters[key as keyof T];
        if (Array.isArray(value)) {
          queryBuilder.andWhere(`entity.${key} IN (:...${key})`, {
            [key]: value,
          });
        } else if (value !== undefined) {
          queryBuilder.andWhere(`entity.${key} LIKE :${key}`, {
            [key]: `%${value}%`,
          });
        }
      });
    }

    return queryBuilder.getMany();
  }

  async findById(id: number): Promise<T | null> {
    const entity = await this.repository.findOneBy({
      id,
    } as FindOptionsWhere<T>);
    return entity || null;
  }

  async save(entity: T): Promise<T> {
    const newEntity = await this.repository.save(entity);
    return newEntity;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
