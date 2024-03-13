import {
  Controller,
  Post,
  Param,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { TicketsService } from "./tickets.service";
import { Users } from "src/users/entities/users.entity";
import { GetUserInfo } from "src/utils/get-user-info.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { TransactionManager } from "src/utils/transaction-manager.decorator";
import { TransactionInterceptor } from "src/utils/transaction-interceptor";
import { EntityManager } from "typeorm";

@UseGuards(RolesGuard)
@Controller("tickets")
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post(":performanceId/:seatId")
  @UseInterceptors(TransactionInterceptor)
  async createTickets(
    @TransactionManager() transactionManager: EntityManager,
    @Param("performanceId") performanceId: number,
    @Param("seatId") seatId: number,
    @GetUserInfo() user: Users,
  ) {
    return await this.ticketsService.createTickets(
      performanceId,
      seatId,
      user,
      transactionManager,
    );
  }
}
