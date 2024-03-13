import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Param,
  UseInterceptors,
} from "@nestjs/common";
import { PerformanceService } from "./performance.service";
import { CreatePerformanceDto } from "./dto/create-performance.dto";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { Role } from "src/users/types/usersRole.type";
import { TransactionInterceptor } from "src/utils/transaction-interceptor";
import { TransactionManager } from "src/utils/transaction-manager.decorator";
import { EntityManager } from "typeorm";

@UseGuards(RolesGuard)
@Controller("performance")
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Roles(Role.Admin)
  @Post("/register")
  @UseInterceptors(TransactionInterceptor)
  async registerPerformance(
    @TransactionManager() transactionManager: EntityManager,
    @Body() createPerformanceDto: CreatePerformanceDto,
  ) {
    return await this.performanceService.registerPerformance(
      createPerformanceDto,
      transactionManager,
    );
  }
  // 공연 목록 조회 API
  @Get()
  async getAllPerformances() {
    return await this.performanceService.getAllPerformances();
  }

  // 공연명으로 공연 정보 조회 API
  @Get("/search")
  async getPerformanceByName(@Query("name") name: string) {
    return await this.performanceService.getPerformanceByName(name);
  }

  // 공연번호로 공연 정보 및 예약 가능한 좌석 수 조회 API
  @Get("/:id")
  async getPerformanceDetails(@Param("id") id: number) {
    return await this.performanceService.getPerformanceDetails(id);
  }
}
