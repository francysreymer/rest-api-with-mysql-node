import createError from 'http-errors';
import { injectable, inject } from 'inversify';
import { QueryFailedError } from 'typeorm';

import TYPES from '@/config/types';
import IUserRepository from '@/contracts/IUserRepository';
import IUserService from '@/contracts/IUserService';
import { User } from '@/entities/User';

@injectable()
export default class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async findAll(filters?: {
    name?: string;
    email?: string;
    roles?: string[];
  }): Promise<User[]> {
    return this.userRepository.findAll(filters);
  }

  async findById(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new createError.NotFound(`User with id ${id} not found`);
    }
    return user;
  }

  async create(user: User) {
    try {
      return await this.userRepository.save(user);
    } catch (error: Error | QueryFailedError | unknown) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes('duplicate key value')
      ) {
        throw new createError.Conflict(
          `User with email ${user.email} already exists`,
        );
      }
      throw error;
    }
  }

  async update(user: User, id: number) {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new createError.NotFound(`User with id ${id} not found`);
    }
    return this.userRepository.save(user);
  }

  async delete(id: number) {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new createError.NotFound(`User with id ${id} not found`);
    }
    return this.userRepository.delete(id);
  }
}
