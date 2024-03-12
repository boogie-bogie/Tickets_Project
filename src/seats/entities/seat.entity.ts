
import { Performance } from "src/performance/entities/performance.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SeatsStatus } from "../types/seatsRow.type";
import { Tickets } from "src/tickets/entities/ticket.entity";


    @Entity({
        name: 'seats', 
      })
export class Seats {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: SeatsStatus, nullable: false  }) 
    status: SeatsStatus;

    @Column({ type: 'bigint', default: 30000, nullable: false }) 
    price: number;

    @ManyToOne(()=> Tickets, (ticket) => ticket.seats)
    @JoinColumn({name: 'ticket_id', referencedColumnName: 'id'})
    ticket: Tickets | null;

    @Column({ type: 'bigint', nullable: true }) 
    ticket_id: number;
    
    @ManyToOne(()=> Performance, (performance) => performance.seats)
    @JoinColumn({name: 'perf_id', referencedColumnName: 'id'})
    performance: Performance;
  
    @Column({ type: 'bigint', nullable: false }) 
    perf_id: number;

}
