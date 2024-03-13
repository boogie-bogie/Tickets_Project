import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreatePerformanceDto } from "./dto/create-performance.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Performance } from "./entities/performance.entity";
import { DataSource, QueryResult, QueryRunner, Repository } from "typeorm";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import _ from "lodash";
import { SeatsService } from "src/seats/seats.service";
import { CreateSeatsDto } from "src/seats/dto/create-seat.dto";
import { SeatsStatus } from "src/seats/types/seatsRow.type";
import { Seats } from "src/seats/entities/seat.entity";

@Injectable()
export class PerformanceService {
  private logger = new Logger("PerformanceService");
  constructor(
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /** getRepository
   * this로 묶인 TypeORM의 Repository - this.performanceRepository를 반환하거나,
   * Query Runner로부터 만들어낸 Repository - queryRunner.manager.getRepository(Performance)를 반환하는 함수
   * qr 이라는 매개변수를 전달받는다면 (truthy) -> 쿼리러너로 실행하고,
   * 그렇지 않으면, 일반 repository로 실행하게 만든다.
   */

  // getRepository(qr?: QueryRunner) {
  //   return qr ? qr.manager.getRepository<Performance>(Performance) : this.performanceRepository;
  // }
  // const repository = this.getRepository(qr);

  async registerPerformance(createPerformanceDto: CreatePerformanceDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // const performance = this.performanceRepository.create(createPerformanceDto);
      // await this.performanceRepository.save(performance);
      const performance = queryRunner.manager
        .getRepository(Performance)
        .create(createPerformanceDto);
      await queryRunner.manager.getRepository(Performance).save(performance);

      // 좌석 생성 및 저장
      const createSeatsDto: CreateSeatsDto = {
        status: SeatsStatus.Empty,
        price: 30000,
        perf_id: performance.id,
      };

      const seats: Seats[] = [];
      console.log("DTO", createSeatsDto);
      // 좌석 생성
      for (let i = 0; i < 50; i++) {
        // const seat = this.seatsRepository.create({
        const seat = queryRunner.manager.getRepository(Seats).create({
          ...createSeatsDto,
        });
        seats.push(seat);
      }
      // throw new NotFoundException('트랜잭션 롤백 테스트')
      console.log("seats for문 끝남", seats);
      await queryRunner.manager.getRepository(Seats).save(seats);
      // return await this.seatsRepository.save(seats)
      // await this.seatsService.createSeats(createSeatsDto)

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getAllPerformances() {
    const cachePerformances = await this.cacheManager.get("performances");
    if (!_.isNil(cachePerformances)) {
      this.logger.log("cache Hit:");
      return cachePerformances;
    }

    this.logger.log("cache Miss:");
    const performances = await this.performanceRepository.find();

    await this.cacheManager.set("performances", performances);
    return performances;
  }

  async getPerformanceByName(name: string) {
    const performanceInfos = await this.performanceRepository.findOne({
      where: {
        name,
      },
    });
    if (_.isNil(performanceInfos)) {
      throw new NotFoundException(`존재하지 않는 ${name}입니다.`);
    }
    /**
     * const seats = this.seatsService.findOneByPerfId(performanceInfos.id)
     * return { ...performanceInfos, seats }
     */
    return performanceInfos;
  }
}
