import { Repository } from 'typeorm';

import { User, UserRole } from '@/entities/User';
import UserRepository from '@/repositories/UserRepository';

describe('UserRepository', () => {
  let repository: jest.Mocked<Repository<User>>;
  let userRepository: UserRepository;

  beforeEach(() => {
    repository = {
      createQueryBuilder: jest.fn().mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      }),
      findOneBy: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;
    userRepository = new UserRepository(repository);
  });

  it('should filter users by name, email, and roles', async () => {
    const filters = {
      name: 'test',
      email: 'test@example.com',
      role: [UserRole.ADMIN, UserRole.CLIENTE] as UserRole[],
    };
    const queryBuilder = repository.createQueryBuilder();
    (queryBuilder.getMany as jest.Mock).mockResolvedValue([new User()]);

    const result = await userRepository.findAll(filters);
    expect(result).toHaveLength(1);
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      'entity.name LIKE :name',
      {
        name: '%test%',
      },
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      'entity.email LIKE :email',
      {
        email: '%test@example.com%',
      },
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      'entity.role IN (:...role)',
      {
        role: ['admin', 'cliente'],
      },
    );
    expect(queryBuilder.getMany).toHaveBeenCalled();
  });

  it('should find a user by id', async () => {
    const user = new User();
    repository.findOneBy.mockResolvedValue(user);

    const result = await userRepository.findById(1);
    expect(result).toEqual(user);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should return null if user not found by id', async () => {
    repository.findOneBy.mockResolvedValue(null);

    const result = await userRepository.findById(1);
    expect(result).toBeNull();
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should save a user', async () => {
    const user = new User();
    repository.save.mockResolvedValue(user);

    const result = await userRepository.save(user);
    expect(result).toEqual(user);
    expect(repository.save).toHaveBeenCalledWith(user);
  });

  it('should delete a user by id', async () => {
    await userRepository.delete(1);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});
