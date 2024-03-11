import { Module } from '@nestjs/common';
import { PointsService } from './points.service';
import { PointsController } from './points.controller';
import { Points } from './entities/point.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ TypeOrmModule.forFeature([Points])],
  controllers: [PointsController],
  providers: [PointsService],
  exports: [PointsService]
})
export class PointsModule {}
