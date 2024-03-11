import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PointsService } from './points.service';
import { CreatePointsDto } from './dto/create-point.dto';
import { GetUserInfo } from 'src/utils/get-user-info.decorator';
import { Users } from 'src/users/entities/users.entity';


@Controller('points')
export class PointsController {
  constructor(private pointsService: PointsService) {}

  // @Post()
  // async create(
  //   @Body() createPointsDto: CreatePointsDto) {
  //   const { amount, user_id } = createPointsDto;
  //   return this.pointsService.create(amount, user_id);
  // }
}
