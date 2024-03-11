import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

import { Users } from './entities/users.entity';
import { UsersService } from './users.service';
import { GetUserInfo } from 'src/utils/get-user-info.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService) {}

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto):Promise<void> {
    return await this.userService.signup(
      createUserDto.email,
      createUserDto.password,
      createUserDto.name,
      );
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto): Promise<{message: string, accessToken: string, refreshToken: string }> {
    return await this.userService.login(
      loginDto.email,
      loginDto.password
      );
  }

  @Get('/:id')
  async getUserProfile(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOneById(id)
  }

  @Get('/email')
  @UseGuards(AuthGuard('jwt')) 
  getEmail(@GetUserInfo() user: Users) {
    return { email: user.email };
  }
}