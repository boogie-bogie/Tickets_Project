import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Seats } from "src/performance/entities/seat.entity";
import { Performance } from "src/performance/entities/performance.entity";

@Entity({ name: "tickets" })
export class Tickets {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Seats, (seat) => seat.ticket, { eager: true })
  seats: Seats[];

  @OneToMany(() => Performance, (performance) => performance.ticket, {
    eager: true,
  })
  performances: Performance[];

  // @OneToMany(()=> Seats, (seat) => seat.performance, {eager: true})
  // histories: Tickets_History[];
}
