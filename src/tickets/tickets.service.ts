import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";
import { Tickets } from "./entities/ticket.entity";
import { Users } from "src/users/entities/users.entity";
import { Seats } from "src/performance/entities/seat.entity";
import { Points } from "src/points/entities/point.entity";
import { SeatsStatus } from "src/performance/types/seatsRow.type";
import { Performance } from "src/performance/entities/performance.entity";

@Injectable()
export class TicketsService {
  private logger = new Logger("TicketsService");
  constructor(
    @InjectRepository(Tickets)
    private ticketsRepository: Repository<Tickets>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async createTickets(
    performanceId: number,
    seatId: number,
    user: Users,
    transactionManager: EntityManager,
  ) {
    try {
      // 공연 조회
      const targetPerformance = await transactionManager
        .createQueryBuilder()
        .select("performance")
        .from(Performance, "performance")
        .where("performance.id = :id", { id: performanceId })
        .getOne();

      if (!targetPerformance) {
        throw new NotFoundException("존재하지 않는 공연입니다.");
      }

      // 좌석 조회
      const targetSeat = await transactionManager
        .createQueryBuilder(Seats, "seat")
        .where("seat.perf_id = :perfId", { perfId: performanceId })
        .andWhere("seat.id = :id", { id: seatId })
        .getOne();

      if (targetSeat === undefined || targetSeat === null) {
        throw new NotFoundException("선택한 좌석을 찾을 수 없습니다.");
      }
      if (targetSeat.status !== SeatsStatus.Empty) {
        throw new ConflictException("선택한 좌석은 이미 예약되었습니다.");
      }
      if (targetSeat.ticket_id) {
        throw new ConflictException("이미 예약된 좌석입니다.");
      }

      // 좌석 상태 변경
      targetSeat.status = SeatsStatus.Ticketed;
      await transactionManager.save(targetSeat);

      // 포인트 조회
      const points = await transactionManager
        .createQueryBuilder(Points, "point")
        .where("point.user_id = :userId", { userId: user.id })
        .getOne();

      if (!points) {
        throw new NotFoundException("포인트 정보를 찾을 수 없습니다.");
      }
      if (+points.amount < +targetSeat.price) {
        throw new ConflictException("포인트가 부족합니다.");
      }
      // 포인트 차감
      points.amount -= targetSeat.price;
      await transactionManager.save(points);

      // 티켓 생성
      const newTicket = this.ticketsRepository.create({
        user_id: user.id,
        seats: [targetSeat],
      });
      await transactionManager.save(newTicket);

      return {
        message: "예매가 완료되었습니다.",
        data: {
          id: newTicket.id,
          name: targetPerformance.name,
          category: targetPerformance.category,
          seat_id: targetSeat.id,
          seat_price: targetSeat.price,
          location: targetPerformance.location,
          perf_startTime: targetPerformance.perf_startTime,
        },
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException("예매 중 오류가 발생했습니다.");
      }
    }
  }

  async getTicketsHistory(user: Users) {
    const ticketsHistory = await this.ticketsRepository.find({
      where: {
        user_id: user.id,
      },
      order: {
        createdAt: "DESC",
      },
    });

    return ticketsHistory;
  }
}

// 트랜잭션 적용 전
// import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
// import { Users } from "src/users/entities/users.entity";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Tickets } from "./entities/ticket.entity";
// import { Repository, getManager } from "typeorm";
// import { Seats } from "src/performance/entities/seat.entity";
// import { Performance } from "src/performance/entities/performance.entity";
// import { SeatsStatus } from "src/performance/types/seatsRow.type";
// import { Points } from "src/points/entities/point.entity";

// @Injectable()
// export class TicketsService {

//   constructor(
//     @InjectRepository(Tickets)
//     private ticketsRepository: Repository<Tickets>,
//     @InjectRepository(Performance)
//     private readonly performanceRepository: Repository<Performance>,
//     @InjectRepository(Seats)
//     private readonly seatsRepository: Repository<Seats>,
//     @InjectRepository(Users)
//     private readonly usersRepository: Repository<Users>,
//     @InjectRepository(Points)
//     private readonly pointsRepository: Repository<Points>,

//   ) {}

//   async createTickets(
//     performanceId: number,
//     seatId: number,
//     user: Users
//   ) {
//     const targetPerformance = await this.performanceRepository.findOne({
//       where: {
//         id: performanceId
//       }
//     });
//     console.log('-------------targetPerformance:', targetPerformance)
//     if(!targetPerformance) {
//       throw new NotFoundException('존재하지 않는 공연입니다.')
//     }

// // 해당 공연에 존재하는 좌석들을 조회
// const seats = await this.seatsRepository.find({
//   where: {
//     perf_id: performanceId,
//   },
// });

// console.log('-------------targetPerformance.id:', targetPerformance.id)

// // 좌석들 중에서 매개변수로 받은 seatId로 조회
// const targetSeat = seats.find(seat => seat.id === seatId);

// console.log('-------------targetSeat:', targetSeat)
// // 만약 조회된 좌석이 없다면 에러를 던짐
// if (targetSeat === undefined || targetSeat === null) {
//   throw new NotFoundException('선택한 좌석을 찾을 수 없습니다.');
// }
// console.log('-------------seatId:', seatId)
// console.log('-------------targetSeat.id:', targetSeat.id)
// console.log('-------------targetSeat.perf_id:', targetSeat.perf_id)

// // 좌석의 상태가 'Empty'인지 확인
// if (targetSeat.status !== SeatsStatus.Empty) {
//   throw new ConflictException('선택한 좌석은 이미 예약되었습니다.');
// }

// // 좌석에 이미 티켓이 부여되었는지 확인
// if (targetSeat.ticket_id) {
//   throw new ConflictException('이미 예약된 좌석입니다.');
// }

//     // 'Empty'상태 -> 'Ticketed' 상태로 변경하고,
//     targetSeat.status = SeatsStatus.Ticketed;
//       // 변경된 상태를 DB에 저장한다.
//       await this.seatsRepository.save(targetSeat);
//       console.log('-------------targetSeat.status:', targetSeat.status)
//       // userId로 유저의 포인트를 조회한다.
//       const points = await this.pointsRepository.findOne({
//         where: {
//           user_id: user.id
//         }
//       });
//       console.log('-------------points:', points)
//       if (!points) {
//         throw new NotFoundException('포인트 정보를 찾을 수 없습니다.');
//       }
//       console.log('-------------points.amount:', points.amount)
//       console.log('-------------targetSeat.price:', targetSeat.price)
//       console.log('-------------points.amount:', typeof points.amount)
//       console.log('-------------targetSeat.price:', typeof targetSeat.price)
//       // 조회한 포인트가 좌석의 가격보다 적으면, 잔액 부족
//       if (+points.amount < +targetSeat.price) {
//         throw new ConflictException('포인트가 부족합니다.');
//       }
//       // 가격만큼 포인트를 차감한다.
//       points.amount -= targetSeat.price;
//     console.log('-------------points.amount:', points.amount)
//     await this.pointsRepository.save(points);

//     // 티켓 생성 후 완료 메세지
//     const newTicket = this.ticketsRepository.create({
//       user_id: user.id,
//       seats: [targetSeat]
//     });
//     console.log('-------------newTicket:', newTicket)
//     await this.ticketsRepository.save(newTicket);

//     return { message: '예매가 완료되었습니다.' };
//   }
// }
