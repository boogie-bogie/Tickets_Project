import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "../types/tickekts-status.type";
import { Seats } from "src/seats/entities/seat.entity";
import { Performance } from "src/performance/entities/performance.entity";

@Entity({ name: 'tickets'})
export class Tickets {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: Status, nullable: false  }) 
    status: Status;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(()=> Seats, (seat) => seat.ticket, {eager: true})
    seats: Seats[];

    @OneToMany(()=> Performance, (performance) => performance.ticket, {eager: true})
    performances: Performance[];

    // @OneToMany(()=> Seats, (seat) => seat.performance, {eager: true})
    // histories: Tickets_History[];
}
