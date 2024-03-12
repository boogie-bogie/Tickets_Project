import { Injectable } from '@nestjs/common';
import { CreateSeatsDto } from './dto/create-seat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seats } from './entities/seat.entity';
import { Repository } from 'typeorm';
import { SeatsStatus } from './types/seatsRow.type';

@Injectable()
export class SeatsService {

  constructor(
    @InjectRepository(Seats)
    private seatsRepository: Repository<Seats>,
  ) {}

  async createSeats(createSeatsDto: CreateSeatsDto): Promise<Seats[]>  {
    const seats: Seats[] = [];
    console.log('DTO', createSeatsDto)
    // 좌석 생성
    for (let i = 0; i < 50; i++) {
      const seat = this.seatsRepository.create({
        ...createSeatsDto
      });
      seats.push(seat);
    }
    console.log('seats for문 끝남', seats)
    return await this.seatsRepository.save(seats)
  }

  findAll() {
    return `This action returns all seats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seat`;
  }


}
