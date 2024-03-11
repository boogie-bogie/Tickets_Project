import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Performance } from './entities/performance.entity';
import { Repository } from 'typeorm';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import _ from 'lodash';

@Injectable()
export class PerformanceService {
  private logger = new Logger('PerformanceService')
  constructor(
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async registerPerformance(createPerformanceDto: CreatePerformanceDto) {
    const performance = this.performanceRepository.create(createPerformanceDto);
    return await this.performanceRepository.save(performance);
  }

  async getAllPerformances() {
    const cachePerformances = await this.cacheManager.get('performances') 
    if(!_.isNil(cachePerformances)) { 
      this.logger.log('cache Hit:')
      return cachePerformances;
    }
  
    this.logger.log('cache Miss:')
    const performances = await this.performanceRepository.find();
  
    await this.cacheManager.set('performances', performances) 
    return performances; 
  }

  async getPerformanceByName(name: string) {
    const performanceInfos = await this.performanceRepository.findOne({
      where: {
        name,
      },
    })
    if(_.isNil(performanceInfos)) {
      throw new NotFoundException(`존재하지 않는 ${name}입니다.`)
    }
    return performanceInfos;
  }


}
