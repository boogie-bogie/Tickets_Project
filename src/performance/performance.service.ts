import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Performance } from './entities/performance.entity';
import { Repository } from 'typeorm';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import _ from 'lodash';
import { SeatsService } from 'src/seats/seats.service';
import { CreateSeatsDto } from 'src/seats/dto/create-seat.dto';
import { SeatsStatus } from 'src/seats/types/seatsRow.type';

@Injectable()
export class PerformanceService {
  private logger = new Logger('PerformanceService')
  constructor(
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,
    private readonly seatsService: SeatsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async registerPerformance(createPerformanceDto: CreatePerformanceDto) {
    const performance = this.performanceRepository.create(createPerformanceDto);
    await this.performanceRepository.save(performance);

    // 좌석 생성 및 저장
  const createSeatsDto: CreateSeatsDto = { 
    status: SeatsStatus.Empty,
    price: 30000,
    perf_id: performance.id
  };
    await this.seatsService.createSeats(createSeatsDto)
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
    /**
     * const seats = this.seatsService.findOneByPerfId(performanceInfos.id)
     * return { ...performanceInfos, seats }
     */
    return performanceInfos;
  }


}
