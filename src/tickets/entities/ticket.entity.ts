import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Seats } from "src/performance/entities/seat.entity";
import { Performance } from "src/performance/entities/performance.entity";
import { Users } from "src/users/entities/users.entity";

@Entity({ name: "tickets" })
export class Tickets {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Seats, (seat) => seat.ticket, {
    eager: true,
  })
  seats: Seats[];

  @OneToMany(() => Performance, (performance) => performance.ticket, {
    eager: true,
  })
  performances: Performance[];

  @ManyToOne(() => Users, (user) => user.tickets)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: Users | null;

  @Column({ type: "bigint", nullable: true })
  user_id: number;
}
