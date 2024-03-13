import { Module } from "@nestjs/common";
import { TicketsService } from "./tickets.service";
import { TicketsController } from "./tickets.controller";
import { Tickets } from "./entities/ticket.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PerformanceModule } from "src/performance/performance.module";
import { Performance } from "src/performance/entities/performance.entity";
import { Seats } from "src/performance/entities/seat.entity";
import { Points } from "src/points/entities/point.entity";
import { PointsModule } from "src/points/points.module";
import { UsersModule } from "src/users/users.module";
import { Users } from "src/users/entities/users.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Tickets, Performance, Seats, Users, Points]),
    PerformanceModule,
    UsersModule,
    PointsModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
