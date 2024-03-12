import { IsNumber } from 'class-validator';
import { Users } from 'src/users/entities/users.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'points', 
})
export class Points {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column({ type: 'bigint', default: 1000000, nullable: false }) 
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(()=> Users, (user) => user.points)
  @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
  user: Users;

  @Column({type: 'bigint', name: 'user_id'})
  user_id: number;
}

