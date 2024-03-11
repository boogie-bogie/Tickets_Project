import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/types/usersRole.type';

@UseGuards(RolesGuard)
@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Roles(Role.Admin)
  @Post('/register')
  async registerPerformance(@Body() createPerformanceDto: CreatePerformanceDto) {
    return await this.performanceService.registerPerformance(createPerformanceDto);
  }


  @Get()
  async getAllPerformances() {
    return await this.performanceService.getAllPerformances();
  }

  @Get('/search')
  async getPerformanceByName(@Body() name: string) {
    return await this.performanceService.getPerformanceByName(name);
  }
}
