import { User } from '@/entities/User';

export default interface IUserRepository {
  findAll(filters?: {
    name?: string;
    email?: string;
    roles?: string[];
  }): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: number): Promise<void>;
}
