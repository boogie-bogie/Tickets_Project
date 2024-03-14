import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  /**
   * 이메일
   * @example "example@example.com"
   */
  @ApiProperty({
    example: "test@gmail.com",
    description: "이메일",
  })
  @IsEmail()
  @IsNotEmpty({ message: "이메일을 입력해주세요." })
  readonly email: string;

  @ApiProperty({
    example: "aabb1122",
    description: "비밀번호",
  })
  @IsString()
  @MinLength(8, {
    message: "비밀번호는 8자리 이상이어야 합니다.",
  })
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: "비밀번호는 영어와 숫자만 포함될 수 있습니다.",
  })
  @IsNotEmpty({ message: "비밀번호를 입력해주세요." })
  readonly password: string;

  @ApiProperty({
    example: "이하이",
    description: "이름",
  })
  @IsString()
  @IsNotEmpty({ message: "이름을 입력해주세요." })
  readonly name: string;
}
