import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

enum UserRole {
  ADMIN = 'admin',
  CLIENTE = 'cliente',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

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
