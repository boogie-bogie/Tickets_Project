import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { PerformanceModule } from "./performance/performance.module";
import { PointsModule } from "./points/points.module";
import { CacheModule } from "@nestjs/cache-manager";
import { TicketsModule } from "./tickets/tickets.module";
import { ConfigModuleValidationSchema } from "./config/env-validation.config";
import { typeOrmModuleOptions } from "./config/database.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ConfigModuleValidationSchema,
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
