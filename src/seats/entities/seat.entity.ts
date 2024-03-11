
import { Performance } from "src/performance/entities/performance.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Row } from "../types/seatsRow.type";


    @Entity({
        name: 'seats', 
      })
export class Seats {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: Row, nullable: false  }) 
    row: Row;

    @Column({ type: 'bigint', nullable: false }) 
    price: number;

    @ManyToOne(()=> Performance, (performance) => performance.seats)
    @JoinColumn({name: 'perf_id'})
    performance: Performance;
  
    @Column({type: 'bigint', name: 'perf_id'})
    perf_id: number;
}
