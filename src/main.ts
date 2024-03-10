import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const PORT = 3000;
  await app.listen(PORT);
  Logger.log(`${PORT}번 포트로 서버 실행 중...`);
}

bootstrap();
