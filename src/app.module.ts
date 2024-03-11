import Joi from "joi";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

import { AuthModule } from './auth/auth.module';
import { Users } from "./users/entities/users.entity";
import { UsersModule } from './users/users.module';
import { PerformanceModule } from './performance/performance.module';
import { SeatsModule } from './seats/seats.module';
import { PointsModule } from './points/points.module';
import { Points } from "./points/entities/point.entity";
import { Performance } from "./performance/entities/performance.entity";
import { Seats } from "./seats/entities/seat.entity";


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
    entities: [Users, Points, Performance, Seats],
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
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    UsersModule,
    PerformanceModule,
    PointsModule,
    SeatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
