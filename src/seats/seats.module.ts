import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seats } from './entities/seat.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Seats])],
  controllers: [SeatsController],
  providers: [SeatsService],
  exports: [SeatsService]
})
export class SeatsModule {}
