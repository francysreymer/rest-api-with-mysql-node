import createError from 'http-errors';

import IRepository from '@/contracts/IRepository';
import { BaseEntity } from '@/entities/BaseEntity';
import { BaseService } from '@/services/BaseService';

class TestEntity extends BaseEntity {
  name!: string;
}

class TestService extends BaseService<TestEntity> {
  protected getEntityName(): string {
    return 'TestEntity';
  }
}

describe('BaseService', () => {
  let repository: jest.Mocked<IRepository<TestEntity>>;
  let service: TestService;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IRepository<TestEntity>>;
    service = new TestService(repository);
  });

  it('should find all entities', async () => {
    const entities = [new TestEntity()];
    repository.findAll.mockResolvedValue(entities);

    const result = await service.findAll();
    expect(result).toEqual(entities);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('should find an entity by id', async () => {
    const entity = new TestEntity();
    repository.findById.mockResolvedValue(entity);

    const result = await service.findById(1);
    expect(result).toEqual(entity);
    expect(repository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw not found error if entity does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findById(1)).rejects.toThrow(createError.NotFound);
  });

  it('should create a new entity', async () => {
    const entity = new TestEntity();
    repository.save.mockResolvedValue(entity);

    const result = await service.create(entity);
    expect(result).toEqual(entity);
    expect(repository.save).toHaveBeenCalledWith(entity);
  });

  it('should update an existing entity', async () => {
    const entity = new TestEntity();
    repository.findById.mockResolvedValue(entity);
    repository.save.mockResolvedValue(entity);

    const result = await service.update(entity, 1);
    expect(result).toEqual(entity);
    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(repository.save).toHaveBeenCalledWith(entity);
  });

  it('should throw not found error if entity to update does not exist', async () => {
    const entity = new TestEntity();
    repository.findById.mockResolvedValue(null);

    await expect(service.update(entity, 1)).rejects.toThrow(
      createError.NotFound,
    );
  });

  it('should delete an existing entity', async () => {
    const entity = new TestEntity();
    repository.findById.mockResolvedValue(entity);

    await service.delete(1);
    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw not found error if entity to delete does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.delete(1)).rejects.toThrow(createError.NotFound);
  });
});
