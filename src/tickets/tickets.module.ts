import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Tickets } from './entities/ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ TypeOrmModule.forFeature([Tickets])],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
