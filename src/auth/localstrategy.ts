import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: "email",
      passwordField: "password",
    });
  }

  // async validate(email: string, password: string) {
  //     const user = await this.usersService.validateUser({ email, password})

  //     if (!user) {
  //         throw new UnauthorizedException('일치하는 인증 정보가 없습니다.')
  //     }
  //     return user;
  // }
}
