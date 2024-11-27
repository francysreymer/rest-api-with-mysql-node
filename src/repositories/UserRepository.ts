import { injectable, inject } from 'inversify';
import { Repository } from 'typeorm';

import TYPES from '@/config/types';
import IRepository from '@/contracts/IRepository';
import { User } from '@/entities/User';
import { BaseRepository } from '@/repositories/BaseRepository';

@injectable()
export default class UserRepository
  extends BaseRepository<User>
  implements IRepository<User>
{
  constructor(@inject(TYPES.DB) repository: Repository<User>) {
    super(repository);
  }

  async findAll(filters?: Partial<User> | undefined): Promise<User[]> {
    const queryBuilder = this.repository.createQueryBuilder('user');

    if (filters) {
      Object.keys(filters).forEach((key) => {
        const value = filters[key as keyof User];
        if (key === 'roles' && Array.isArray(value)) {
          queryBuilder.andWhere('user.role IN (:...roles)', { roles: value });
        } else if (Array.isArray(value)) {
          queryBuilder.andWhere(`user.${key} IN (:...${key})`, {
            [key]: value,
          });
        } else if (value !== undefined) {
          queryBuilder.andWhere(`user.${key} LIKE :${key}`, {
            [key]: `%${value}%`,
          });
        }
      });
    }

    const users = await queryBuilder.getMany();
    return users;
  }
}
