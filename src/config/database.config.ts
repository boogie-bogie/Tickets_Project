import { ConfigService } from "@nestjs/config";
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from "@nestjs/typeorm";
import { Seats } from "src/performance/entities/seat.entity";
import { Points } from "src/points/entities/point.entity";
import { Tickets } from "src/tickets/entities/ticket.entity";
import { Users } from "src/users/entities/users.entity";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

export const typeOrmModuleOptions: TypeOrmModuleAsyncOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: "postgres",
    username: configService.get<string>("DB_USERNAME"),
    password: configService.get<string>("DB_PASSWORD"),
    host: configService.get<string>("DB_HOST"),
    port: configService.get<number>("DB_PORT"),
    database: configService.get<string>("DB_NAME"),
    synchronize: configService.get<boolean>("DB_SYNC"),
    entities: [Users, Points, Performance, Seats, Tickets],
    autoLoadEntities: true,
    logging: true,
  }),
  inject: [ConfigService],
};
