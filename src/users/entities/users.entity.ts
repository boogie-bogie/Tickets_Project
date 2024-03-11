import { Column, Entity, Index, OneToMany,OneToOne,PrimaryGeneratedColumn } from 'typeorm';

import { Role } from '../types/usersRole.type';



@Index('email', ['email'], { unique: true })
@Entity({
  name: 'users', 
})
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false }) 
  email: string;

  @Column({ type: 'varchar', select: false, nullable: false }) 
  password: string;

  @Column({ type: 'varchar', nullable: false }) 
  name: string;

  @Column({ type: 'enum', enum: Role, default: Role.User }) 
  role: Role;

  @Column({ type: 'boolean', default: false }) 
  is_admin: boolean;

}