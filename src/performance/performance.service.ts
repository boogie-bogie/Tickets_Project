import { Injectable } from '@nestjs/common';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Performance } from './entities/performance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PerformanceService {

  constructor(
    @InjectRepository(Performance)
    private userRepository: Repository<Performance>
  ) {}

  create(createPerformanceDto: CreatePerformanceDto) {
    return 'This action adds a new performance';
  }

  findAll() {
    return `This action returns all performance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} performance`;
  }

  update(id: number, updatePerformanceDto: UpdatePerformanceDto) {
    return `This action updates a #${id} performance`;
  }

  remove(id: number) {
    return `This action removes a #${id} performance`;
  }
}
