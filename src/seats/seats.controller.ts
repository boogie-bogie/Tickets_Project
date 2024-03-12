import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeatsService } from './seats.service';


@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Get()
  findAll() {
    return this.seatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seatsService.findOne(+id);
  }


}
