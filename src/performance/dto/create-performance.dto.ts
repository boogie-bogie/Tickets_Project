import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MinLength,
} from "class-validator";
import { Category } from "../types/performance-category.type";
import { StartTime } from "../types/performance-startTime.type";

export class CreatePerformanceDto {
  @IsString()
  @MinLength(2, { message: "공연명은 최소 2글자 이상이어야 합니다." })
  @IsNotEmpty({ message: "공연명을 입력해주세요." })
  name: string;

  @IsString()
  @MinLength(8, {
    message: "공연에 대한 설명은 최소 8글자 이상이어야 합니다.",
  })
  @IsNotEmpty({ message: "공연에 대한 설명을 입력해주세요." })
  description: string;

  @IsEnum(Category, { message: "유효하지 않은 카테고리입니다." })
  @IsNotEmpty({ message: "카테고리를 입력해주세요." })
  category: Category;

  @IsString()
  @IsNotEmpty({ message: "이미지 링크를 입력해주세요." })
  image: string;

  @IsString()
  @IsNotEmpty({ message: "공연 장소를 입력해주세요." })
  location: string;

  @IsOptional()
  @IsNumber()
  @Max(50, { message: "총 좌석 수는 50석을 넘길 수 없습니다." })
  totalSeats: number = 50;

  @IsDateString({}, { message: "올바른 공연 날짜를 입력해주세요." })
  @IsNotEmpty({ message: "공연 날짜를 입력해주세요." })
  perf_date: Date[];

  @IsEnum(StartTime, { message: "유효하지 않은 공연 시간입니다." })
  @IsNotEmpty({ message: "공연 시간을 입력해주세요." })
  perf_startTime: StartTime[];
}
