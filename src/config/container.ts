import 'reflect-metadata';
import { Container } from 'inversify';

import { db } from '@/config/db';
import TYPES from '@/config/types';
import IRepository from '@/contracts/IRepository';
import IService from '@/contracts/IService';
import UserController from '@/controllers/UserController';
import { User } from '@/entities/User';
import UserRepository from '@/repositories/UserRepository';
import UserService from '@/services/UserService';

const container = new Container();

container.bind<IRepository<User>>(TYPES.IRepository).toDynamicValue(() => {
  const userRepository = db.getRepository(User);
  return new UserRepository(userRepository);
});
container.bind<IService<User>>(TYPES.IService).to(UserService);
container.bind(TYPES.DB).toConstantValue(db);
container.bind<UserController>(TYPES.UserController).to(UserController);

export default container;
