import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Param,
  UseInterceptors,
  HttpStatus,
} from "@nestjs/common";
import { PerformanceService } from "./performance.service";
import { CreatePerformanceDto } from "./dto/create-performance.dto";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { Role } from "src/users/types/usersRole.type";
import { TransactionInterceptor } from "src/utils/transaction-interceptor";
import { TransactionManager } from "src/utils/transaction-manager.decorator";
import { EntityManager } from "typeorm";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiRequestTimeoutResponse,
  ApiTags,
} from "@nestjs/swagger";
import { FindAllPerformancesDto } from "./dto/findAll-performance.dto";

@ApiTags("Performance")
@UseGuards(RolesGuard)
@Controller("performance")
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @ApiOperation({ summary: "공연 등록 및 좌석 생성 API" })
  @ApiBearerAuth("access-token")
  @Roles(Role.Admin)
  @Post("/register")
  @UseInterceptors(TransactionInterceptor)
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       name: {
  //         type: "string",
  //         description: "공연명: 옥탑방 고양이"
  //       },
  //       description: {
  //         type: "string",
  //         description: "공연 설명: 대학로 옥탑방 고양이",
  //       },
  //       category: {
  //         type: "enum",

  //       }
  //     "category": "Play",
  //     "image": "http://localhost:3000/",
  //     "location": "예술의 전당",
  //     "perf_date": "2024-03-01",
  //     "perf_startTime": "오후 3시"

  //   }
  // })
  async registerPerformance(
    @TransactionManager() transactionManager: EntityManager,
    @Body() createPerformanceDto: CreatePerformanceDto,
  ) {
    return await this.performanceService.registerPerformance(
      createPerformanceDto,
      transactionManager,
    );
  }

  @ApiOperation({ summary: "공연 목록 조회 API" })
  @ApiBearerAuth("access-token")
  @Get()
  async getAllPerformances(
    @Query() findAllPerformancesDto: FindAllPerformancesDto,
  ) {
    const data = await this.performanceService.getAllPerformances(
      findAllPerformancesDto,
    );

    return {
      statusCode: HttpStatus.OK,
      message: "공연 목록 조회에 성공하였습니다.",
      data,
    };
  }

  @ApiOperation({ summary: "공연명으로 공연 정보 조회 API" })
  @ApiBearerAuth("access-token")
  @ApiQuery({ name: "name", required: true, description: "performance_name" })
  @Get("/search")
  async getPerformanceByName(@Query("name") name: string) {
    const data = await this.performanceService.getPerformanceByName(name);
    return {
      statusCode: HttpStatus.OK,
      message: "공연 정보 조회에 성공하였습니다.",
      data,
    };
  }

  @ApiOperation({
    summary: "공연번호로 공연 정보 및 예약 가능한 좌석 수 조회 API",
  })
  @ApiBearerAuth("access-token")
  @ApiParam({ name: "id", required: true, description: "performanceId" })
  @Get("/:id")
  async getPerformanceDetails(@Param("id") id: number) {
    const data = await this.performanceService.getPerformanceDetails(id);

    const message = ` 공연명: '${data.name}', 현재 ${data.AvailableSeatsCount}석 예매 가능`;
    return {
      statusCode: HttpStatus.OK,
      message: message,
      data,
    };
  }
}
