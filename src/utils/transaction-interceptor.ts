import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, catchError, tap } from "rxjs";
import { DataSource } from "typeorm";

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("REPEATABLE READ"); // REPEATABLE READ 격리 수준 설정

    const request = context.switchToHttp().getRequest();
    request.queryRunnerManager = queryRunner.manager;

    return next.handle().pipe(
      catchError(async (error: Error) => {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        if (error instanceof HttpException) {
          throw new HttpException(error.getResponse(), error.getStatus());
        } else {
          throw new InternalServerErrorException();
        }
      }),
      tap(async () => {
        await queryRunner.commitTransaction();
        await queryRunner.release();
      }),
    );
  }
}
