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
/**
 * 포인트 생성(create): 새로운 포인트를 생성하고 저장합니다. 주로 사용자가 회원가입할 때나 특정 이벤트 발생 시에 포인트를 부여하는데 사용됩니다.
포인트 조회(findById, findByUserId): 특정 포인트를 ID나 사용자 ID를 기준으로 조회합니다.
포인트 업데이트(update): 포인트의 양을 증가하거나 감소시킵니다. 예를 들어, 사용자가 활동을 통해 포인트를 획득하거나 사용할 때 호출됩니다.
 */
