import { injectable, inject } from 'inversify';
import { Repository } from 'typeorm';

import TYPES from '@/config/types';
import IUserRepository from '@/contracts/IUserRepository';
import { User } from '@/entities/User';

@injectable()
export default class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor(@inject(TYPES.DB) repository: Repository<User>) {
    this.repository = repository;
  }

  async findAll(filters?: {
    name?: string;
    email?: string;
    roles?: string[];
  }): Promise<User[]> {
    const queryBuilder = this.repository.createQueryBuilder('user');

    if (filters?.name) {
      queryBuilder.andWhere('user.name LIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    if (filters?.email) {
      queryBuilder.andWhere('user.email LIKE :email', {
        email: `%${filters.email}%`,
      });
    }

    if (filters?.roles && filters.roles.length > 0) {
      queryBuilder.andWhere('user.role IN (:...roles)', {
        roles: filters.roles,
      });
    }

    const users = await queryBuilder.getMany();
    return users;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.repository.findOneBy({ id });
    return user || null;
  }

  async save(user: User): Promise<User> {
    const newUser = await this.repository.save(user);
    return newUser;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}
