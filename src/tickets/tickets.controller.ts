import {
  Controller,
  Post,
  Param,
  UseGuards,
  UseInterceptors,
  Get,
  HttpStatus,
} from "@nestjs/common";
import { TicketsService } from "./tickets.service";
import { Users } from "src/users/entities/users.entity";
import { GetUserInfo } from "src/utils/get-user-info.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { TransactionManager } from "src/utils/transaction-manager.decorator";
import { TransactionInterceptor } from "src/utils/transaction-interceptor";
import { EntityManager } from "typeorm";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Tickets")
@UseGuards(RolesGuard)
@Controller("tickets")
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "공연 좌석 지정하여 예매 API" })
  @ApiParam({
    name: "performanceId",
    required: true,
    description: "performanceId",
  })
  @ApiParam({ name: "seatId", required: true, description: "seatId" })
  @Post(":performanceId/:seatId")
  @UseInterceptors(TransactionInterceptor)
  async createTickets(
    @TransactionManager() transactionManager: EntityManager,
    @Param("performanceId") performanceId: number,
    @Param("seatId") seatId: number,
    @GetUserInfo() user: Users,
  ) {
    const data = await this.ticketsService.createTickets(
      performanceId,
      seatId,
      user,
      transactionManager,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: "공연 예매에 성공하였습니다.",
      data,
    };
  }

  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "userId의 예매 내역 목록 조회 API" })
  @Get("/history")
  async getTicketsHistory(@GetUserInfo() user: Users) {
    const data = await this.ticketsService.getTicketsHistory(user);
    return {
      statusCode: HttpStatus.OK,
      message: "예매 내역 조회에 성공하였습니다.",
      data,
    };
  }
}
