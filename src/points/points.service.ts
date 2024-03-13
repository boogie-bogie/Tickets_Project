import { Injectable, NotFoundException } from "@nestjs/common";

import { Points } from "./entities/point.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import _ from "lodash";

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(Points)
    private pointsRepository: Repository<Points>,
  ) {}

  async createPoints(amount: number, userId: number): Promise<Points> {
    const points = this.pointsRepository.create({
      amount,
      user_id: userId,
    });
    return await this.pointsRepository.save(points);
  }
}
