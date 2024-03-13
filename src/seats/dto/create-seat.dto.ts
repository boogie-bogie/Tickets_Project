import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Max } from "class-validator";
import { SeatsStatus } from "../types/seatsRow.type";

export class CreateSeatsDto {
  @IsEnum(SeatsStatus, { message: "유효하지 않은 상태값입니다." })
  @IsNotEmpty({ message: "좌석의 상태값을 입력해주세요." })
  status: SeatsStatus;

  @IsNumber()
  @IsNotEmpty({ message: "좌석의 가격을 입력해주세요." })
  @Max(50000, { message: "좌석당 상한 금액인 5만원을 넘길 수 없습니다." })
  price: number;

  @IsNumber()
  perf_id: number;
}
