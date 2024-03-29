import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Users } from "./entities/users.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { Points } from "src/users/entities/point.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Points]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET_KEY"),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
