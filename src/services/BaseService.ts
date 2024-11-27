import createError from 'http-errors';
import { injectable } from 'inversify';

import IRepository from '@/contracts/IRepository';
import { BaseEntity } from '@/entities/BaseEntity';

@injectable()
export abstract class BaseService<T extends BaseEntity> {
  protected repository: IRepository<T>;

  constructor(repository: IRepository<T>) {
    this.repository = repository;
  }

  async findAll(filters?: Partial<T>): Promise<T[]> {
    return this.repository.findAll(filters);
  }

  async findById(id: number): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new createError.NotFound(
        `${this.getEntityName()} with id ${id} not found`,
      );
    }
    return entity;
  }

  async create(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async update(entity: T, id: number): Promise<T> {
    const existingEntity = await this.repository.findById(id);
    if (!existingEntity) {
      throw new createError.NotFound(
        `${this.getEntityName()} with id ${id} not found`,
      );
    }
    const updatedEntity = { ...existingEntity, ...entity };
    return this.repository.save(updatedEntity);
  }

  async delete(id: number): Promise<void> {
    const existingEntity = await this.repository.findById(id);
    if (!existingEntity) {
      throw new createError.NotFound(
        `${this.getEntityName()} with id ${id} not found`,
      );
    }
    return this.repository.delete(id);
  }

  protected abstract getEntityName(): string;
}
