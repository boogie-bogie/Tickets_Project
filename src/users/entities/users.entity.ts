import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Role } from "../types/usersRole.type";
import { Points } from "src/users/entities/point.entity";
import { Tickets } from "src/tickets/entities/ticket.entity";

@Index("email", ["email"], { unique: true })
@Entity({
  name: "users",
})
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", unique: true, nullable: false })
  email: string;

  @Column({ type: "varchar", select: false, nullable: false })
  password: string;

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "enum", enum: Role, default: Role.User })
  role: Role;

  @Column({ type: "boolean", default: false })
  is_admin: boolean;

  @OneToMany(() => Points, (point) => point.user, {
    eager: true,
    cascade: true,
  })
  points: Points[];

  @OneToMany(() => Tickets, (ticket) => ticket.user, {
    eager: true,
    cascade: true,
  })
  tickets: Tickets[];
}
