import createError from 'http-errors';

import IRepository from '@/contracts/IRepository';
import { User } from '@/entities/User';
import UserService from '@/services/UserService';

describe('UserService', () => {
  let repository: jest.Mocked<IRepository<User>>;
  let service: UserService;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IRepository<User>>;
    service = new UserService(repository);
  });

  it('should find all users', async () => {
    const users = [new User()];
    repository.findAll.mockResolvedValue(users);

    const result = await service.findAll();
    expect(result).toEqual(users);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('should find a user by id', async () => {
    const user = new User();
    repository.findById.mockResolvedValue(user);

    const result = await service.findById(1);
    expect(result).toEqual(user);
    expect(repository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw not found error if user does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findById(1)).rejects.toThrow(createError.NotFound);
  });

  it('should create a new user', async () => {
    const user = new User();
    repository.save.mockResolvedValue(user);

    const result = await service.create(user);
    expect(result).toEqual(user);
    expect(repository.save).toHaveBeenCalledWith(user);
  });

  it('should update an existing user', async () => {
    const user = new User();
    repository.findById.mockResolvedValue(user);
    repository.save.mockResolvedValue(user);

    const result = await service.update(user, 1);
    expect(result).toEqual(user);
    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(repository.save).toHaveBeenCalledWith(user);
  });

  it('should throw not found error if user to update does not exist', async () => {
    const user = new User();
    repository.findById.mockResolvedValue(null);

    await expect(service.update(user, 1)).rejects.toThrow(createError.NotFound);
  });

  it('should delete an existing user', async () => {
    const user = new User();
    repository.findById.mockResolvedValue(user);

    await service.delete(1);
    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw not found error if user to delete does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.delete(1)).rejects.toThrow(createError.NotFound);
  });
});
