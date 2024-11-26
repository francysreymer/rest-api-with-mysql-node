import 'reflect-metadata';
import { Container } from 'inversify';

import { db } from '@/config/db';
import TYPES from '@/config/types';
import IUserRepository from '@/contracts/IUserRepository';
import IUserService from '@/contracts/IUserService';
import UserController from '@/controllers/UserController';
import UserRepository from '@/repositories/UserRepository';
import UserService from '@/services/UserService';

const container = new Container();

container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.IUserService).to(UserService);
container.bind(TYPES.DB).toConstantValue(db);
container.bind<UserController>(TYPES.UserController).to(UserController);

export default container;
