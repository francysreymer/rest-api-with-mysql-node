import { User } from '@/entities/User';

export default interface IUserService {
  findAll(filters?: {
    name?: string;
    email?: string;
    roles?: string[];
  }): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User, id: number): Promise<User>;
  delete(id: number): Promise<void>;
}
