import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";

import { Users } from "./entities/users.entity";
import { UsersService } from "./users.service";
import { GetUserInfo } from "src/utils/get-user-info.decorator";
import { TransactionInterceptor } from "src/utils/transaction-interceptor";
import { TransactionManager } from "src/utils/transaction-manager.decorator";
import { EntityManager } from "typeorm";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /**
   * 회원가입
   * @param transactionManager
   * @param createUserDto
   * @returns
   */
  @ApiOperation({ summary: "회원가입 API" })
  @Post("/signup")
  @UseInterceptors(TransactionInterceptor)
  async signup(
    @TransactionManager() transactionManager: EntityManager,
    @Body() createUserDto: CreateUserDto,
  ) {
    return await this.userService.signup(
      createUserDto.email,
      createUserDto.password,
      createUserDto.name,
      transactionManager,
    );
  }

  @ApiOperation({ summary: "로그인 API" })
  @Post("/login")
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ message: string; accessToken: string; refreshToken: string }> {
    return await this.userService.login(loginDto.email, loginDto.password);
  }

  @ApiOperation({ summary: "사용자 정보 조회 API" })
  @ApiParam({ name: "id", required: true, description: "user_id" })
  @Get("/:id")
  async getUserProfile(@Param("id", ParseIntPipe) id: number) {
    const data = await this.userService.findOneById(id);
    return {
      statusCode: HttpStatus.OK,
      message: "사용자 정보 조회에 성공하였습니다.",
      data,
    };
  }
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "email로 인증 테스트 API" })
  @Get("/email")
  @UseGuards(AuthGuard("jwt"))
  getEmail(@GetUserInfo() user: Users) {
    return { email: user.email };
  }
}
