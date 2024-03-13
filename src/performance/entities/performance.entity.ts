import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "../types/performance-category.type";
import { StartTime } from "../types/performance-startTime.type";
import { Seats } from "src/performance/entities/seat.entity";
import { Tickets } from "src/tickets/entities/ticket.entity";

@Entity({
  name: "performance",
})
export class Performance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: false })
  description: string;

  @Column({ type: "enum", enum: Category, nullable: false })
  category: Category;

  @Column({ type: "varchar", nullable: false })
  image: string;

  @Column({ type: "varchar", nullable: false })
  location: string;

  @Column({ type: "jsonb", nullable: false })
  perf_date: Date[];

  @Column({ type: "jsonb", nullable: false })
  perf_startTime: StartTime[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "bigint", nullable: false })
  totalSeats: number;

  @OneToMany(() => Seats, (seat) => seat.performance, {
    eager: true,
    cascade: true,
  })
  seats: Seats[];

  @ManyToOne(() => Tickets, (ticket) => ticket.performances)
  @JoinColumn({ name: "ticket_id", referencedColumnName: "id" })
  ticket: Tickets | null;

  @Column({ type: "bigint", nullable: true })
  ticket_id: number;
}
