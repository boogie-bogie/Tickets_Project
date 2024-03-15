import { IsEnum, IsOptional, IsString } from "class-validator";
import { Category } from "../types/performance-category.type";

export class FindAllPerformancesDto {
  /**
   * 검색 키워드
   * @example "옥탑방"
   */
  @IsOptional()
  @IsString()
  keyword?: string;

  /**
   * 카테고리
   * @example "Musical"
   */
  @IsOptional()
  @IsEnum(Category)
  category?: Category;
}
