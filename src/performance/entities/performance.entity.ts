import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../types/performance-category.type';
import { StartTime } from '../types/performance-startTime.type';
import { Seats } from 'src/seats/entities/seat.entity';

@Entity({
  name: 'performance',
})
export class Performance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false }) 
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'enum', enum: Category, nullable: false}) 
  category: Category;

  @Column({ type: 'varchar', nullable: false })
  image: string;

  @Column({ type: 'varchar', nullable: false })
  location: string;

  @Column({ type: 'varchar', nullable: false })
  perf_date: Date;

  @Column({ type: 'enum', enum: StartTime, nullable: false}) 
  perf_startTime: StartTime;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(()=> Seats, (seat) => seat.performance)
  seats: Seats[];

}