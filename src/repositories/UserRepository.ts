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
}
