import { Module } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { PerformanceController } from './performance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Performance } from './entities/performance.entity';
import { SeatsModule } from 'src/seats/seats.module';
import { Seats } from 'src/seats/entities/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Performance, Seats]), SeatsModule],
  controllers: [PerformanceController],
  providers: [PerformanceService],
})
export class PerformanceModule {}
