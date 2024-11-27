import { injectable, inject } from 'inversify';

import TYPES from '@/config/types';
import IRepository from '@/contracts/IRepository';
import IService from '@/contracts/IService';
import { User } from '@/entities/User';
import { BaseService } from '@/services/BaseService';

@injectable()
export default class UserService
  extends BaseService<User>
  implements IService<User>
{
  constructor(@inject(TYPES.IRepository) repository: IRepository<User>) {
    super(repository);
  }

  protected getEntityName(): string {
    return 'User';
  }
}
