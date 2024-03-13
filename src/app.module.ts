import Joi from "joi";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

import { AuthModule } from "./auth/auth.module";
import { Users } from "./users/entities/users.entity";
import { UsersModule } from "./users/users.module";
import { PerformanceModule } from "./performance/performance.module";
import { PointsModule } from "./points/points.module";
import { Points } from "./points/entities/point.entity";
import { Performance } from "./performance/entities/performance.entity";
import { Seats } from "./performance/entities/seat.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { TicketsModule } from "./tickets/tickets.module";
import { Tickets } from "./tickets/entities/ticket.entity";

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: "postgres",
    username: configService.get("DB_USERNAME"),
    password: configService.get("DB_PASSWORD"),
    host: configService.get("DB_HOST"),
    port: configService.get("DB_PORT"),
    database: configService.get("DB_NAME"),
    entities: [Users, Points, Performance, Seats, Tickets],
    synchronize: configService.get("DB_SYNC"),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    CacheModule.register({
      ttl: 60000, // 데이터 캐싱 시간(밀리 초 단위, 1000 = 1초)
      max: 100, // 최대 캐싱 개수
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    UsersModule,
    PerformanceModule,
    PointsModule,
    TicketsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
