import { Repository } from 'typeorm';

import { BaseRepository, Identifiable } from '@/repositories/BaseRepository';

class TestEntity implements Identifiable {
  id!: number;
  name!: string;
}

class TestRepository extends BaseRepository<TestEntity> {}

describe('BaseRepository', () => {
  let repository: jest.Mocked<Repository<TestEntity>>;
  let baseRepository: TestRepository;

  beforeEach(() => {
    const queryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };

    repository = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
      findOneBy: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<TestEntity>>;
    baseRepository = new TestRepository(repository);
  });

  it('should find all entities with filters', async () => {
    const filters = { name: 'test' };
    const queryBuilder = repository.createQueryBuilder();
    (queryBuilder.getMany as jest.Mock).mockResolvedValue([new TestEntity()]);

    const result = await baseRepository.findAll(filters);
    expect(result).toHaveLength(1);
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      'entity.name LIKE :name',
      { name: '%test%' },
    );
    expect(queryBuilder.getMany).toHaveBeenCalled();
  });

  it('should find an entity by id', async () => {
    const entity = new TestEntity();
    repository.findOneBy.mockResolvedValue(entity);

    const result = await baseRepository.findById(1);
    expect(result).toEqual(entity);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should return null if entity not found by id', async () => {
    repository.findOneBy.mockResolvedValue(null);

    const result = await baseRepository.findById(1);
    expect(result).toBeNull();
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should save an entity', async () => {
    const entity = new TestEntity();
    repository.save.mockResolvedValue(entity);

    const result = await baseRepository.save(entity);
    expect(result).toEqual(entity);
    expect(repository.save).toHaveBeenCalledWith(entity);
  });

  it('should delete an entity by id', async () => {
    await baseRepository.delete(1);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});
