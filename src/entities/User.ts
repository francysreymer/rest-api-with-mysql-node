import { Entity, Column } from 'typeorm';

import { BaseEntity } from '@/entities/BaseEntity';

export enum UserRole {
  ADMIN = 'admin',
  CLIENTE = 'cliente',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ nullable: false })
  name!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
  })
  role!: UserRole;
}
