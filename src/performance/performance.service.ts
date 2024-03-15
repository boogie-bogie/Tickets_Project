import _ from "lodash";

import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Like, Repository } from "typeorm";

import { Performance } from "./entities/performance.entity";
import { CreatePerformanceDto } from "./dto/create-performance.dto";

import { SeatsStatus } from "src/performance/types/seatsRow.type";
import { Seats } from "src/performance/entities/seat.entity";
import { CreateSeatsDto } from "src/performance/dto/create-seat.dto";
import { FindAllPerformancesDto } from "./dto/findAll-performance.dto";

@Injectable()
export class PerformanceService {
  private logger = new Logger("PerformanceService");
  constructor(
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,
    @InjectRepository(Seats)
    private seatsRepository: Repository<Seats>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async registerPerformance(
    createPerformanceDto: CreatePerformanceDto,
    transactionManager: EntityManager,
  ) {
    try {
      const performance = transactionManager.create(
        Performance,
        createPerformanceDto,
      );
      await transactionManager.save(performance);

      const createSeatsDto: CreateSeatsDto = {
        status: SeatsStatus.Empty,
        price: 30000,
        perf_id: performance.id,
      };
      const seats: Seats[] = [];

      for (let i = 0; i < createPerformanceDto.totalSeats; i++) {
        const seat = transactionManager.create(Seats, createSeatsDto);
        seats.push(seat);
      }

      await transactionManager.save(seats);
      //throw new NotFoundException('트랜잭션 롤백 테스트')

      return { message: "공연 등록에 성공하였습니다." };
    } catch (error) {
      throw new InternalServerErrorException(
        "공연 등록 중 오류가 발생했습니다.",
      );
    }
  }

  async getAllPerformances({ keyword, category }: FindAllPerformancesDto) {
    const cachePerformances = await this.cacheManager.get("performances");
    if (!_.isNil(cachePerformances)) {
      this.logger.log("cache Hit:");
      return cachePerformances;
    }

    this.logger.log("cache Miss:");
    const performances = await this.performanceRepository.find({
      where: {
        ...(keyword && { name: Like(`%${keyword}%`) }),
        ...(category && { category }),
      },
    });

    await this.cacheManager.set("performances", performances);
    return performances;
  }

  async getPerformanceByName(name: string): Promise<Performance> {
    const performanceInfo = await this.performanceRepository.findOne({
      where: { name },
    });
    if (!performanceInfo) {
      throw new NotFoundException(`존재하지 않는 ${name}입니다.`);
    }
    return performanceInfo;
  }

  async getPerformanceDetails(id: number): Promise<any> {
    const performance = await this.performanceRepository.findOne({
      where: {
        id,
      },
    });

    if (!performance) {
      throw new NotFoundException("해당 공연을 찾을 수 없습니다.");
    }

    // 예약 가능한 좌석 수를 조회
    const seats = await this.seatsRepository.find({
      where: { perf_id: id, ticket_id: null, status: SeatsStatus.Empty },
    });

    /**예약 가능한 좌석의 id와 price를 배열 형태로 매핑해서 가져온다.
     * 예시 - 등급은 제외
     * [ { seat_num: 32, grade: B, price: 30000}, { seat_num: 290, grade: A, price: 40000}, … ]
     */
    const isAvailableSeatsInfo = seats.map((seat) => ({
      id: seat.id,
      price: seat.price,
    }));

    const message = ` 공연명: '${performance.name}', 현재 ${seats.length}석 예매 가능`;

    return {
      message: message,
      data: {
        id: performance.id,
        name: performance.name,
        category: performance.category,
        image: performance.image,
        location: performance.location,
        perf_startTime: performance.perf_startTime,
        AvailableSeatsCount: seats.length,
        AvailableSeatsInfo: isAvailableSeatsInfo,
      },
    };
  }
}
